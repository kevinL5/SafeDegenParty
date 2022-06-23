/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery, MockAggregator } from "../typechain";

describe("Lottery - select winner", function () {
  // const [, addr1, addr2] = await ethers.getSigners();
  let lottery: Lottery;
  let mockAggregator: MockAggregator;

  beforeEach(async () => {
    const [, addr1] = await ethers.getSigners();
    const MockAggregator = await ethers.getContractFactory("MockAggregator");
    mockAggregator = await MockAggregator.deploy();

    await mockAggregator.setRound(1);
    await mockAggregator.setAnswer(4000);

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(mockAggregator.address);
    await lottery.deployed();

    await lottery.participate(0, {
      value: ethers.utils.parseUnits("100", "wei"),
    });
    await lottery.connect(addr1).participate(1, {
      value: ethers.utils.parseUnits("1", "wei"),
    });

    await mockAggregator.setRound(2);
    await mockAggregator.setAnswer(1000);
  });

  it("should revert if select winner is not called by owner", async function () {
    const [, , addr2] = await ethers.getSigners();
    await expect(lottery.connect(addr2).selectWinner()).to.be.reverted;
  });

  it("should allow owner to select winner", async function () {
    await expect(lottery.selectWinner()).to.not.be.reverted;
  });

  it("should revert if latestRound <= creationRound", async function () {
    await mockAggregator.setRound(1);

    await expect(lottery.selectWinner()).to.be.reverted;
  });

  it("should set winner with right choice", async function () {
    const [, addr1] = await ethers.getSigners();

    const tx = await lottery.selectWinner();
    await tx.wait();

    expect(await lottery.winner()).to.equal(addr1.address);
  });
});
