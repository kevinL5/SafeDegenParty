// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MockAggregator {
  int256 public s_answer;
	int256 public s_round;
  int256 public s_roundId;

  function setAnswer(int256 answer) public {
    s_answer = answer;
  }

  function latestAnswer() public view returns (int256) {
    return s_answer;
  }

  function getTimestamp(uint256 roundId) public pure returns(uint256) {
    if (roundId == 1) return 1;
    return 2;
  }

  function getAnswer(uint256 roundId) public view returns (int256) {
    if (roundId == 0) return s_answer;
    return s_answer;
  }

	function setRound(int256 round) public {
    s_round = round;
  }


	function latestRound() public view returns (int256) {
		return s_round;
	}
}