const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecord", () => {
	let medical, user1, transactionResponse, transactionReceipt;
	const testRecord = [
		"Wastron",
		22,
		"Male",
		"B positive",
		"Dengue",
		"Dengue",
		"Dengue"
	];

	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		user1 = accounts[1];
		const Medical = await ethers.getContractFactory("MedicalRecord");
		medical = await Medical.connect(user1).deploy();
	});

	describe("Deployed", () => {
		it("The contract is deployed successfully", async () => {
			expect(medical.address).to.not.equal(0);
		});
	});

	describe("Add record", () => {
		beforeEach(async () => {
			transactionResponse = await medical.connect(user1).addRecord(...testRecord);
			transactionReceipt = await transactionResponse.wait();
		});

		it("Emits an add record event", async () => {
			const events = transactionReceipt.logs
				.map(log => {
					try {
						return medical.interface.parseLog(log);
					} catch {
						return null;
					}
				})
				.filter(e => e && e.name === "MedicalRecord__AddRecord");

			expect(events.length).to.equal(1);

			const args = events[0].args;
			expect(args.timestamp).to.not.equal(0);
			expect(args.name).to.equal(testRecord[0]);
			expect(args.age).to.equal(testRecord[1]);
			expect(args.gender).to.equal(testRecord[2]);
			expect(args.bloodType).to.equal(testRecord[3]);
			expect(args.allergies).to.equal(testRecord[4]);
			expect(args.diagnosis).to.equal(testRecord[5]);
			expect(args.treatment).to.equal(testRecord[6]);
		});

		it("The getRecords function is working", async () => {
			const recordId = await medical.getRecordId();
			const [
				timestamp,
				name,
				age,
				gender,
				bloodType,
				allergies,
				diagnosis,
				treatment,
			] = await medical.getRecord(recordId);
			expect(recordId).to.equal(1);
			expect(timestamp).to.not.equal(0);
			expect(name).to.equal(testRecord[0]);
			expect(age).to.equal(testRecord[1]);
			expect(gender).to.equal(testRecord[2]);
			expect(bloodType).to.equal(testRecord[3]);
			expect(allergies).to.equal(testRecord[4]);
			expect(diagnosis).to.equal(testRecord[5]);
			expect(treatment).to.equal(testRecord[6]);
		});
	});

	describe("Delete record", () => {
		beforeEach(async () => {
			await medical.connect(user1).addRecord(...testRecord);
			transactionResponse = await medical.connect(user1).deleteRecord(1);
			transactionReceipt = await transactionResponse.wait();
		});

		it("Marks the record as deleted", async () => {
			expect(await medical.getDeleted(1)).to.be.equal(true);
		});

		it("Emits a delete event", async () => {
			const events = transactionReceipt.logs
				.map(log => {
					try {
						return medical.interface.parseLog(log);
					} catch {
						return null;
					}
				})
				.filter(e => e && e.name === "MedicalRecord__DeleteRecord");

			expect(events.length).to.equal(1);

			const args = events[0].args;
			expect(events[0].name).to.equal("MedicalRecord__DeleteRecord");
			expect(args.timestamp).to.not.equal(0);
			expect(args.name).to.equal(testRecord[0]);
			expect(args.age).to.equal(testRecord[1]);
			expect(args.gender).to.equal(testRecord[2]);
			expect(args.bloodType).to.equal(testRecord[3]);
			expect(args.allergies).to.equal(testRecord[4]);
			expect(args.diagnosis).to.equal(testRecord[5]);
			expect(args.treatment).to.equal(testRecord[6]);
		});
	});
});
