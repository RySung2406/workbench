(() => {
  const summaries = {
    "https://afdc.energy.gov/vehicles/how-do-all-electric-cars-work":
      "An illustrated guide from the US Department of Energy shows how the battery, electric motor, charger and transmission work together in an electric car.",
    "https://modernrobotics.northwestern.edu/":
      "Northwestern University’s chapter-by-chapter videos cover rigid-body motion, forward kinematics, trajectory planning and control.",
    "https://www.hkeaa.edu.hk/en/HKDSE/assessment/subject_information/category_a_subjects/math/sp/2026_Sample_M2.html":
      "Compare sample scripts at different performance levels to see how HKDSE candidates set out their working and explain solutions to the same M2 questions.",
    "https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/":
      "MIT OpenCourseWare shares course materials and assignments on choosing, analysing and manufacturing components for a mechanical design project."
  };

  window.FIELD_MATERIALS_EN = window.FIELD_MATERIALS.map(item => ({
    ...item,
    summary: summaries[item.url] || item.summary
  }));
})();
