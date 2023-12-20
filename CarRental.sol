// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarRental is Ownable(msg.sender), Pausable {
    enum CarType {
        Economy,
        Standard,
        Luxury
    }

    struct RentalContract {
        uint256 expirationTime;
        address renter;
        CarType carType;
    }

    mapping(CarType => uint256) public rentalPricePerHour;
    mapping(string => RentalContract) private rentalContracts;

    event LogRentalStarted(
        string indexed plate,
        uint256 numOfHours,
        CarType carType
    );
    event LogRentalRenewed(
        string indexed plate,
        uint256 numOfHours,
        CarType carType
    );
    event LogRentalCanceled(string indexed plate, uint256 refundAmount);
    event LogRentalTransferred(string indexed oldPlate, string newPlate);
    event LogRentalPriceChanged(uint256 price, CarType carType);

    /// @notice Check if the renter of a contract is trying to modify it
    /// @param plate The plate of a car that is rented
    modifier isRenter(string memory plate) {
        require(
            msg.sender == rentalContracts[plate].renter,
            "Only the renter can modify the rental contract"
        );
        _;
    }

    constructor() {
        rentalPricePerHour[CarType.Economy] = 0.0001 ether;
        rentalPricePerHour[CarType.Standard] = 0.00015 ether;
        rentalPricePerHour[CarType.Luxury] = 0.0002 ether;
    }

    /// @notice Function that allows starting a car rental or extending an existing one. Can be called if the contract is not paused.
    /// @param plate The plate of a car
    /// @param numOfHours The duration of a car rental (in hours)
    /// @param carType The type of car to rent (one from CarType enum)
    function startRental(
        string memory plate,
        uint256 numOfHours,
        CarType carType
    ) external payable whenNotPaused {
        require(
            numOfHours * rentalPricePerHour[carType] <= msg.value,
            "Amount is not sufficient"
        );

        RentalContract storage rental = rentalContracts[plate];
        uint256 duration = numOfHours * 1 hours;

        // If the rental is not expired yet, then extend it
        if (rental.expirationTime > block.timestamp) {
            require(
                rental.carType == carType,
                "You are trying to renew rental for another car type"
            );
            rental.expirationTime = rental.expirationTime + duration;
            emit LogRentalRenewed(plate, numOfHours, carType);
        } else {
            uint256 expiration = block.timestamp + duration;
            rentalContracts[plate] = RentalContract(expiration, msg.sender, carType);
            emit LogRentalStarted(plate, numOfHours, carType);
        }
    }

    /// @notice Function to change the rental price of a car type. Can be called by the contract owner only.
    /// @param price Price per hour
    /// @param carType The car type for which the owner wants to set a price (one from CarType enum)
    function changeRentalPrice(uint256 price, CarType carType)
        external
        onlyOwner
    {
        rentalPricePerHour[carType] = price;
        emit LogRentalPriceChanged(price, carType);
    }

    /// @notice Check if the rental contract is valid based on the plate and car type
    /// @param plate The plate of a car
    /// @param carType The car type for which the car is rented
    /// @return bool - Return rental contract validity
    function isRentalValid(string memory plate, CarType carType)
        public
        view
        returns (bool)
    {
        return
            rentalContracts[plate].carType == carType &&
            rentalContracts[plate].expirationTime > block.timestamp;
    }

    /// @notice Get rental contract information
    /// @param plate The plate of a car
    /// @return tuple(Rental expiration time, car type)
    function getRental(string memory plate)
        external
        view
        returns (uint256, CarType)
    {
        return (
            rentalContracts[plate].expirationTime,
            rentalContracts[plate].carType
        );
    }

    /// @notice Function to cancel a car rental and get back remaining funds. Can be called by the renter only.
    /// @dev User gets back only 90% of remaining funds
    /// @param plate The plate of a car
    function cancelRental(string memory plate) external isRenter(plate) {
        RentalContract storage rental = rentalContracts[plate];
        require(
            rental.expirationTime > block.timestamp,
            "The rental has already expired"
        );

        uint256 hoursLeft = (rental.expirationTime - block.timestamp) / 3600;
        uint256 refundAmount = (hoursLeft * rentalPricePerHour[rental.carType] * 9) /
            10; // Get back 90% of funds
        delete rentalContracts[plate];
        (bool succeed, ) = msg.sender.call{value: refundAmount}("");
        require(succeed, "Failed to return funds");
        emit LogRentalCanceled(plate, refundAmount);
    }

    /// @notice Transfer a car rental to another owner and car plate.
    /// Can be called by the rental contract owner only.
    /// @param oldPlate The plate user wants to transfer
    /// @param newPlate Plate of a car where the rental will be transferred to
    /// @param newRenter New renter of a rental contract (address)
    function transferRental(
        string memory oldPlate,
        string memory newPlate,
        address newRenter
    ) external isRenter(oldPlate) {
        require(
            rentalContracts[newPlate].expirationTime <= block.timestamp,
            "You cannot transfer rental to a plate with an active subscription"
        );

        RentalContract storage old = rentalContracts[oldPlate];
        rentalContracts[newPlate] = RentalContract(
            old.expirationTime,
            newRenter,
            old.carType
        );
        delete rentalContracts[oldPlate];
        emit LogRentalTransferred(oldPlate, newPlate);
    }

    /// @notice Function to pause the contract. Can be called by contract owner only.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Function to unpause the contract. Can be called by contract owner only.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Function to withdraw ether from
}