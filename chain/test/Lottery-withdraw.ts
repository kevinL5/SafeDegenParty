/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery, MockAggregator } from "../typechain";

describe("Lottery - withdraw", function () {
  let lottery: Lottery;
  let mockAggregator: MockAggregator;
  const betValue = ethers.utils.parseUnits("10", "ether");

  beforeEach(async () => {
    const MockAggregator = await ethers.getContractFactory("MockAggregator");
    mockAggregator = await MockAggregator.deploy();

    await mockAggregator.setRound(1);

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(mockAggregator.address);
    await lottery.deployed();

    await lottery.participate(0, {
      value: betValue,
    });

    await mockAggregator.setRound(2);
  });

  it("should revert if not participant", async function () {
    const [, addr1] = await ethers.getSigners();
    await expect(lottery.connect(addr1).withdraw()).to.be.reverted;
  });

  it("should transfer same amount as bet", async function () {
    const [owner] = await ethers.getSigners();

    const prevBalance = await owner.getBalance();

    const withdrawTx = await lottery.withdraw();
    const receiptTx = await withdrawTx.wait();

    const txCost = receiptTx.cumulativeGasUsed.mul(receiptTx.effectiveGasPrice);

    expect(await owner.getBalance()).to.be.equal(
      prevBalance.add(betValue).sub(txCost)
    );
  });

  it("should not be able to call withdraw twice", async function () {
    await lottery.withdraw();

    await expect(lottery.withdraw()).to.be.reverted;
  });
});
