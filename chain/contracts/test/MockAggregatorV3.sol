// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockAggregatorV3 {
  uint8 public constantDecimals = 8;
  string public constantsDescription = "MockAggregatorV3 Description";
  uint256 public constantsVersion = 0;

  uint80 public roundId;
  int256 public answer;
  uint256 public startedAt;
  uint256 public updatedAt;
  uint80 public answeredInRound;

  function setRoundData(uint80 _roundId, int256 _answer, uint256 _startedAt, uint256 _updatedAt, uint80 _answeredInRound) external 
  {
    roundId = _roundId;
    answer = _answer;
    startedAt = _startedAt;
    updatedAt = _updatedAt;
    answeredInRound = _answeredInRound;
  }

  function decimals() external view returns (uint8) {
    return constantDecimals;
  }

  function description() external view returns (string memory) {
    return constantsDescription;
  }

  function version() external view returns (uint256) {
    return constantsVersion;
  }

  function getRoundData(uint80 _roundId)
    external
    view
    returns (uint80, int256, uint256, uint256, uint80) 
  {
    if (_roundId == 0) return (roundId, answer, startedAt, updatedAt, answeredInRound);
    return (roundId, answer, startedAt, updatedAt, answeredInRound);
  }

  function latestRoundData()
    external
    view
    returns (uint80, int256, uint256, uint256, uint80) 
  {
    return (roundId, answer, startedAt, updatedAt, answeredInRound);
  }
}

