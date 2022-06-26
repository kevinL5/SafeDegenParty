/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery, MockAggregatorV3 } from "../typechain";

describe("Lottery - participate", function () {
  let lottery: Lottery;
  let mockAggregatorV3: MockAggregatorV3;

  beforeEach(async () => {
    const MockAggregatorV3 = await ethers.getContractFactory(
      "MockAggregatorV3"
    );
    mockAggregatorV3 = await MockAggregatorV3.deploy();

    await mockAggregatorV3.setRoundData(1, 4000, 0, 0, 0);

    const Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(mockAggregatorV3.address, 10);
    await lottery.deployed();
  });

  it("should have creationRound", async function () {
    expect(await lottery.creationRound()).to.equal(1);
  });

  it("should revert if try to participate without value", async function () {
    await expect(lottery.participate(0)).to.be.reverted;
  });

  it("should send at least on wei to participate", async function () {
    await expect(
      lottery.participate(0, {
        value: ethers.utils.parseUnits("1", "wei"),
      })
    ).to.not.be.reverted;
  });

  it("should save the biggest bet", async function () {
    const [, addr1, addr2] = await ethers.getSigners();

    await lottery.participate(0, {
      value: ethers.utils.parseUnits("1", "wei"),
    });
    await lottery.connect(addr1).participate(0, {
      value: ethers.utils.parseUnits("100", "wei"),
    });
    await lottery.connect(addr2).participate(0, {
      value: ethers.utils.parseUnits("42", "wei"),
    });

    expect(await (await lottery.biggestBetEth()).toString()).to.equal("100");
    expect(await (await lottery.biggestBetUsd()).toString()).to.equal("0");
  });

  it("should save the biggest bet", async function () {
    await lottery.participate(0, {
      value: ethers.utils.parseUnits("1", "wei"),
    });

    await expect(
      lottery.participate(0, {
        value: ethers.utils.parseUnits("1", "wei"),
      })
    ).to.be.reverted;
  });

  it("should revert if latestRound > creationRound + diffBlock", async function () {
    await mockAggregatorV3.setRoundData(42, 100, 0, 0, 0);

    await expect(
      lottery.participate(0, {
        value: ethers.utils.parseUnits("1", "wei"),
      })
    ).to.be.reverted;
  });
});
