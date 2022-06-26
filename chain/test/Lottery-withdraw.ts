/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery, MockAggregatorV3 } from "../typechain";

describe("Lottery - withdraw", function () {
  let lottery: Lottery;
  let mockAggregatorV3: MockAggregatorV3;
  const betValue = ethers.utils.parseUnits("10", "ether");

  beforeEach(async () => {
    const MockAggregatorV3 = await ethers.getContractFactory(
      "MockAggregatorV3"
    );
    mockAggregatorV3 = await MockAggregatorV3.deploy();

    await mockAggregatorV3.setRoundData(1, 4000, 0, 0, 0);

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(mockAggregatorV3.address, 10);
    await lottery.deployed();

    await lottery.participate(0, {
      value: betValue,
    });

    await mockAggregatorV3.setRoundData(42, 1000, 0, 0, 0);
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
