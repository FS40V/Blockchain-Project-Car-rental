// Connect to a local Ethereum node using Web3.js
const web3 = new Web3("http://localhost:7545");

// contract address and ABI
const contractAddress = "0x492Fad21AcF75fA1077217C0c390d5a64c4557F5";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "plate",
				"type": "string"
			}
		],
		"name": "cancelRental",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "enum CarRental.CarType",
				"name": "carType",
				"type": "uint8"
			}
		],
		"name": "changeRentalPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "plate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refundAmount",
				"type": "uint256"
			}
		],
		"name": "LogRentalCanceled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum CarRental.CarType",
				"name": "carType",
				"type": "uint8"
			}
		],
		"name": "LogRentalPriceChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "plate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "numOfHours",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum CarRental.CarType",
				"name": "carType",
				"type": "uint8"
			}
		],
		"name": "LogRentalRenewed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "plate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "numOfHours",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum CarRental.CarType",
				"name": "carType",
				"type": "uint8"
			}
		],
		"name": "LogRentalStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "oldPlate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newPlate",
				"type": "string"
			}
		],
		"name": "LogRentalTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "plate",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "numOfHours",
				"type": "uint256"
			},
			{
				"internalType": "enum CarRental.CarType",
				"name": "carType",
				"type": "uint8"
			}
		],
		"name": "startRental",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "oldPlate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "newPlate",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "newRenter",
				"type": "address"
			}
		],
		"name": "transferRental",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "plate",
				"type": "string"
			}
		],
		"name": "getRental",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "enum CarRental.CarType",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "plate",
				"type": "string"
			},
			{
				"internalType": "enum CarRental.CarType",
				"name": "carType",
				"type": "uint8"
			}
		],
		"name": "isRentalValid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum CarRental.CarType",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "rentalPricePerHour",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

//contract instance
const carRentalContract = new web3.eth.Contract(contractABI, contractAddress);

// Example function to start a car rental
async function startRental() {
    const plate = document.getElementById("plateInput").value;
    const numOfHours = document.getElementById("hoursInput").value;
    const carType = document.getElementById("carTypeSelect").value;

    try {
        // Call the startRental function from your smart contract
        const result = await carRentalContract.methods
            .startRental(plate, numOfHours, carType)
            .send({ from: "YOUR_WALLET_ADDRESS", value: web3.utils.toWei("0.02", "ether") });

        showMessage("Rental started successfully.");
        console.log(result);
    } catch (error) {
        showMessage(`Error: ${error.message}`);
    }
}

// Add similar functions for other smart contract functions

// Example function to get rental information
async function getRentalInfo() {
    const plate = document.getElementById("plateInput").value;

    try {
        // Call the getRental function from your smart contract
        const result = await carRentalContract.methods.getRental(plate).call();

        // Display rental information on the frontend
        document.getElementById("plate").innerText = plate;
        document.getElementById("expirationTime").innerText = new Date(result[0] * 1000).toLocaleString();
        document.getElementById("carType").innerText = result[1];
        showMessage("Rental information retrieved successfully.");
        console.log(result);
    } catch (error) {
        showMessage(`Error: ${error.message}`);
    }
}

function showMessage(message) {
    document.getElementById("message").innerText = message;
}
