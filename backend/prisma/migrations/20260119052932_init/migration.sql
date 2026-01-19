-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "phone" TEXT NOT NULL,
    "mydataConsentMedical" BOOLEAN NOT NULL DEFAULT false,
    "mydataConsentFinance" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "bloodPressureSys" INTEGER,
    "bloodPressureDia" INTEGER,
    "bloodSugar" INTEGER,
    "weight" REAL,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawData" TEXT,
    CONSTRAINT "HealthRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "messageFrom" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "metadata" TEXT,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "monthlyAmount" INTEGER NOT NULL,
    "coverageAmount" INTEGER NOT NULL,
    "coverageRatio" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "disease" TEXT NOT NULL,
    "claimedAmount" INTEGER NOT NULL,
    "approvedAmount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "claimedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME,
    CONSTRAINT "Claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "diagnosis" TEXT,
    "prescription" TEXT,
    "consultationFee" INTEGER NOT NULL DEFAULT 30000,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "prescriptionSent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
