-- CreateTable
CREATE TABLE "MarketSectorTrend" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "demandIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketSectorTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistrictSalaryBenchmark" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "median" INTEGER NOT NULL,
    "q1Salary" INTEGER NOT NULL,
    "q3Salary" INTEGER NOT NULL,
    "jobCount" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DistrictSalaryBenchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillShortage" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "shortage" INTEGER NOT NULL,
    "demandGrowth" INTEGER NOT NULL,
    "salaryPremium" INTEGER NOT NULL,
    "supply" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillShortage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetencyFeedback" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "competency" TEXT NOT NULL,
    "current" INTEGER NOT NULL,
    "desired" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetencyFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandForecast" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "monthOrder" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "actual" INTEGER,
    "forecast" INTEGER NOT NULL,
    "historical" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipPipeline" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "conversionRate" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnershipPipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerSatisfactionTrend" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "quarterOrder" INTEGER NOT NULL DEFAULT 0,
    "overall" DOUBLE PRECISION NOT NULL,
    "graduates" DOUBLE PRECISION NOT NULL,
    "support" DOUBLE PRECISION NOT NULL,
    "processes" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployerSatisfactionTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerEvent" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "monthOrder" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "careerFairs" INTEGER NOT NULL DEFAULT 0,
    "workshops" INTEGER NOT NULL DEFAULT 0,
    "networking" INTEGER NOT NULL DEFAULT 0,
    "attendance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipActivity" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnershipActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniEvent" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "relevantPathIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketSectorTrend_institutionId_quarter_sector_key" ON "MarketSectorTrend"("institutionId", "quarter", "sector");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictSalaryBenchmark_institutionId_district_year_key" ON "DistrictSalaryBenchmark"("institutionId", "district", "year");

-- CreateIndex
CREATE UNIQUE INDEX "SkillShortage_institutionId_skill_key" ON "SkillShortage"("institutionId", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "CompetencyFeedback_institutionId_competency_year_key" ON "CompetencyFeedback"("institutionId", "competency", "year");

-- CreateIndex
CREATE UNIQUE INDEX "DemandForecast_institutionId_year_month_key" ON "DemandForecast"("institutionId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "PartnershipPipeline_institutionId_stage_key" ON "PartnershipPipeline"("institutionId", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerSatisfactionTrend_institutionId_quarter_key" ON "EmployerSatisfactionTrend"("institutionId", "quarter");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerEvent_institutionId_year_month_key" ON "EmployerEvent"("institutionId", "year", "month");

-- AddForeignKey
ALTER TABLE "MarketSectorTrend" ADD CONSTRAINT "MarketSectorTrend_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistrictSalaryBenchmark" ADD CONSTRAINT "DistrictSalaryBenchmark_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillShortage" ADD CONSTRAINT "SkillShortage_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetencyFeedback" ADD CONSTRAINT "CompetencyFeedback_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandForecast" ADD CONSTRAINT "DemandForecast_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipPipeline" ADD CONSTRAINT "PartnershipPipeline_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerSatisfactionTrend" ADD CONSTRAINT "EmployerSatisfactionTrend_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerEvent" ADD CONSTRAINT "EmployerEvent_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipActivity" ADD CONSTRAINT "PartnershipActivity_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniEvent" ADD CONSTRAINT "AlumniEvent_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
