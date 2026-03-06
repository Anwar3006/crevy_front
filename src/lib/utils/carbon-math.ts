// lib/utils/carbon-math.ts
export const calculateProjectMetrics = (project: Record<string, unknown>) => {
  const estimatedImpact = Number(project.estimatedTotalTco2e || 0);
  const totalHectares = Number(project.totalAreaHectares || 0);

  return {
    tco2ePerHectare:
      totalHectares > 0 ? (estimatedImpact / totalHectares).toFixed(2) : "0",
    treesEquivalent: Math.round(estimatedImpact * 25.4), // Based on average tropical tree sequestration
    permanenceScore: project.projectPractices?.length > 2 ? "High" : "Standard",
    projectYears: Math.floor(project.durationMonths / 12),
    // Investor IRR approximation placeholder (logic can be added here)
    estimatedYield: (
      estimatedImpact /
      (project.durationMonths / 12)
    ).toLocaleString(),
  };
};

export const parsePostgresArray = (str: string): string[] => {
  if (!str) return [];
  // Remove the curly braces and split by comma, then clean up quotes
  return str
    .replace(/[{}]/g, "")
    .split(",")
    .map((item) => item.replace(/"/g, "").trim());
};
