// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReportSystem {
    struct BlotterReport {
        uint256 id;
        address reporter;
        string complainantInfo;      // "Name|Contact|Age|Address"
        string respondentInfo;       // "Name|Contact|Age|Address"
        string incidentType;
        string natureOfComplaint;
        string date;
        string time;
        string location;
        string summaryOfIncident;
        string complainantStatement;
        string witnessInfo;          // "Name|Contact|Age|Address|Statement"
        uint256 timestamp;
    }

    uint256 public reportCount;
    mapping(uint256 => BlotterReport) public reports;

    event BlotterReportSubmitted(
        uint256 indexed id,
        address indexed reporter,
        string incidentType,
        string date,
        string time,
        uint256 timestamp
    );

    function submitBlotterReport(
        string memory complainantInfo,
        string memory respondentInfo,
        string memory incidentType,
        string memory natureOfComplaint,
        string memory date,
        string memory time,
        string memory location,
        string memory summaryOfIncident,
        string memory complainantStatement,
        string memory witnessInfo
    ) public {
        reportCount++;

        reports[reportCount] = BlotterReport({
            id: reportCount,
            reporter: msg.sender,
            complainantInfo: complainantInfo,
            respondentInfo: respondentInfo,
            incidentType: incidentType,
            natureOfComplaint: natureOfComplaint,
            date: date,
            time: time,
            location: location,
            summaryOfIncident: summaryOfIncident,
            complainantStatement: complainantStatement,
            witnessInfo: witnessInfo,
            timestamp: block.timestamp
        });

        emit BlotterReportSubmitted(
            reportCount,
            msg.sender,
            incidentType,
            date,
            time,
            block.timestamp
        );
    }

    function getReport(uint256 id) public view returns (BlotterReport memory) {
        require(id > 0 && id <= reportCount, "Report does not exist.");
        return reports[id];
    }
}
