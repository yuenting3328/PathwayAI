-- CreateTable
CREATE TABLE "InstitutionSnapshot" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "employmentRate" DOUBLE PRECISION NOT NULL,
    "medianSalary" DOUBLE PRECISION NOT NULL,
    "timeToOfferDays" DOUBLE PRECISION NOT NULL,
    "employedCount" INTEGER NOT NULL DEFAULT 0,
    "furtherStudyCount" INTEGER NOT NULL DEFAULT 0,
    "seekingCount" INTEGER NOT NULL DEFAULT 0,
    "otherCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgrammeSnapshot" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "employmentRate" DOUBLE PRECISION NOT NULL,
    "medianSalary" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgrammeSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionInsight" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniCareerStage" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "yearsRange" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniCareerStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniSalaryStage" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "yearsRange" TEXT NOT NULL,
    "medianSalary" DOUBLE PRECISION NOT NULL,
    "q1Salary" DOUBLE PRECISION NOT NULL,
    "q3Salary" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniSalaryStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniEngagement" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "mentorshipConnections" INTEGER NOT NULL DEFAULT 0,
    "eventsAttended" INTEGER NOT NULL DEFAULT 0,
    "jobPostings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionSnapshot_institutionId_year_key" ON "InstitutionSnapshot"("institutionId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ProgrammeSnapshot_programmeId_year_key" ON "ProgrammeSnapshot"("programmeId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniCareerStage_institutionId_yearsRange_sector_key" ON "AlumniCareerStage"("institutionId", "yearsRange", "sector");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniSalaryStage_institutionId_yearsRange_key" ON "AlumniSalaryStage"("institutionId", "yearsRange");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniEngagement_institutionId_year_month_key" ON "AlumniEngagement"("institutionId", "year", "month");

-- AddForeignKey
ALTER TABLE "InstitutionSnapshot" ADD CONSTRAINT "InstitutionSnapshot_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammeSnapshot" ADD CONSTRAINT "ProgrammeSnapshot_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionInsight" ADD CONSTRAINT "InstitutionInsight_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniCareerStage" ADD CONSTRAINT "AlumniCareerStage_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniSalaryStage" ADD CONSTRAINT "AlumniSalaryStage_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniEngagement" ADD CONSTRAINT "AlumniEngagement_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
