(() => {
  const topics = {
    auto: {
      name: "Automotive Engineering",
      description: "Use gear ratios and wheel speed to calculate torque and road speed."
    },
    robot: {
      name: "Robotics",
      description: "Work out how a robot moves from its encoder readings and wheel speeds."
    },
    m2: {
      name: "DSE M2",
      description: "Practise algebra and calculus with worked examples on vectors and definite integrals."
    },
    mech: {
      name: "HKU ME",
      description: "Use free-body diagrams and material properties to work out forces and deformation."
    }
  };

  const notes = {
    "gear-ratio": {
      title: "How does a gear ratio affect speed and torque?",
      summary: "Use a 20-tooth gear driving a 60-tooth gear to predict the speed and torque at the output shaft.",
      sections: [
        {
          heading: "Count the teeth",
          text: "As two external gears mesh, the same number of teeth pass through the mesh on each gear. The 20-tooth input gear turns three times for each turn of the 60-tooth output gear. The gears turn in opposite directions. Dividing input speed by output speed gives a reduction ratio of 3 to 1."
        },
        {
          heading: "Allow for power loss",
          text: "Suppose the input shaft delivers 10 N·m at 900 rpm. The output turns at 300 rpm. An ideal gear pair transmits all the input power, so the output torque triples to 30 N·m. At 90% efficiency, the output torque is 10 × 3 × 0.90 = 27 N·m. To check the power in watts using P = Tω, use angular speed in rad/s."
        }
      ]
    },
    "wheel-speed": {
      title: "From wheel speed to road speed",
      summary: "How fast is a car travelling when its wheels turn at 450 rpm? Start with the distance covered in one revolution.",
      sections: [
        {
          heading: "Find the distance per revolution",
          text: "Assume the wheel rolls without slipping and has an effective rolling radius of 0.30 m. It travels one circumference per revolution, so the distance is 2πr ≈ 1.885 m. At 450 rpm, it makes 450 ÷ 60 = 7.5 revolutions per second."
        },
        {
          heading: "Convert to kilometres per hour",
          text: "Multiplying 1.885 m per revolution by 7.5 revolutions per second gives about 14.1 m/s, or 50.9 km/h. If the sensor measures motor speed, use the overall transmission ratio to find wheel speed first. Tyre slip makes the speed inferred from wheel rotation differ from the actual ground speed."
        }
      ]
    },
    "encoder-distance": {
      title: "Estimate travel from encoder counts",
      summary: "Convert the change in an encoder reading into wheel revolutions, then use the wheel circumference to estimate distance.",
      sections: [
        {
          heading: "Measure counts per wheel revolution",
          text: "Mark the wheel, align the mark with a fixed point and note the controller reading. Turn the wheel one full revolution and record the change. If the encoder is on the motor shaft, the gear ratio affects the number of counts per wheel revolution. Measuring at the wheel also accounts for the controller’s decoding mode."
        },
        {
          heading: "Turn the count difference into distance",
          text: "Suppose a wheel of diameter 0.080 m produces 1,440 counts per revolution. A reading that rises from 100 to 460 gives a difference of 360 counts, or a quarter of a revolution. With no slip, the wheel travels (360 ÷ 1,440) × π × 0.080 ≈ 0.0628 m. Keep the sign of the difference to distinguish forward from reverse motion."
        }
      ]
    },
    "differential-drive": {
      title: "Predict a robot’s turn from its wheel speeds",
      summary: "For a differential-drive robot, the average wheel speed gives its forward speed. The difference determines how fast it turns.",
      sections: [
        {
          heading: "Choose a positive direction",
          text: "Take forward wheel motion as positive. Viewed from above, a left turn is a positive, anticlockwise rotation. Let b be the distance between the wheel contact points, and vL and vR the left and right wheel speeds. For rolling without slip, the axle midpoint moves at v = (vR + vL) ÷ 2 and the robot turns at ω = (vR − vL) ÷ b."
        },
        {
          heading: "Calculate the turning radius",
          text: "With b = 0.40 m, vL = 0.20 m/s and vR = 0.40 m/s, the midpoint travels at 0.30 m/s while the robot turns left at 0.50 rad/s. The midpoint follows a circle of radius v ÷ ω = 0.60 m. If both wheels move forward at the same speed, ω is zero and the robot travels straight ahead."
        }
      ]
    },
    "dot-product": {
      title: "Find the angle between two vectors",
      summary: "Calculate the dot product from the vector components, then use it to find the angle.",
      sections: [
        {
          heading: "Connect components to angles",
          text: "In Cartesian coordinates, multiply each pair of corresponding components and add the products. The result is the dot product, also called the scalar product. For two non-zero vectors a and b, it also satisfies a · b = |a||b| cos θ, where θ is the angle between them and lies between 0° and 180°."
        },
        {
          heading: "Check the sign against the angle",
          text: "Take a = (1, 2, 0) and b = (2, 0, 1). Their dot product is 2 and both have length √5, so cos θ = 2/5. In degree mode, the inverse cosine gives θ ≈ 66.4°. The positive dot product confirms that the angle is acute."
        }
      ]
    },
    "signed-area": {
      title: "Find the area when a curve crosses the x-axis",
      summary: "A definite integral counts area below the x-axis as negative. To find the total geometric area, split the interval where the curve changes sign.",
      sections: [
        {
          heading: "Split at the intercept",
          text: "Consider y = x − 1 over 0 ≤ x ≤ 3. It crosses the x-axis at x = 1. The segment from x = 0 to x = 1 lies below the axis, and the segment from x = 1 to x = 3 lies above it. Both contribute positively to the total geometric area."
        },
        {
          heading: "Check the answer with two triangles",
          text: "An antiderivative is F(x) = x²/2 − x. The integral over the whole interval is F(3) − F(0) = 1.5. The triangle below the axis has area 1 × 1 ÷ 2 = 0.5, and the triangle above has area 2 × 2 ÷ 2 = 2. Their total geometric area is 2.5 square units."
        }
      ]
    },
    "beam-reactions": {
      title: "Find the reactions of a simply supported beam",
      summary: "Draw the beam as a free body. Taking moments about one support lets you calculate the vertical reaction at the other.",
      sections: [
        {
          heading: "Label the distances on the free-body diagram",
          text: "A 3 m horizontal beam has a pin support at its left end A and a roller support on a level surface at its right end B. A downward point load of 600 N acts 1 m from A. Neglect the beam’s own weight. Draw upward vertical reactions at A and B. With no horizontal applied load, the horizontal reaction at A is zero."
        },
        {
          heading: "Balance moments, then vertical forces",
          text: "Take anticlockwise moments about A as positive. Moment equilibrium gives RB × 3 − 600 × 1 = 0, so RB = 200 N. Vertical force equilibrium gives RA + RB − 600 = 0, hence RA = 400 N. The larger reaction acts at A, the support closer to the load."
        }
      ]
    },
    "axial-strain": {
      title: "Estimate how far a bar stretches under tension",
      summary: "Use the axial load to find normal stress and strain, then calculate the extension. Keep the area and modulus units consistent.",
      sections: [
        {
          heading: "Check the assumptions",
          text: "Consider a straight bar of constant cross-section loaded in tension along its centreline. Assume the material responds linearly and elastically. In a uniformly loaded segment, the average normal stress is σ = F/A, the axial strain is ε = σ/E and the extension is ΔL = εL. Here E is Young’s modulus and L is the original length."
        },
        {
          heading: "Work in newtons and millimetres",
          text: "Let F = 1,000 N, A = 50 mm², L = 500 mm and E = 200 GPa. Since 1 N/mm² equals 1 MPa, the stress is 20 MPa. Express E in the same units to get 200,000 MPa. The strain is 20 ÷ 200,000 = 0.0001, giving an extension of 0.0001 × 500 = 0.05 mm."
        }
      ]
    }
  };

  const projects = {
    fieldnotes: {
      name: "Workbench Engineering Notebook",
      description: "Short notes on vehicles, robotics, mathematics and mechanics, with worked examples that keep the numbers and units alongside each formula.",
      sections: [
        {
          heading: "Follow a calculation across topics",
          text: "Gear output speed leads to wheel speed. Distance per wheel revolution then helps make sense of a robot’s encoder readings. Follow the related notes to trace the same quantity across different problems."
        }
      ]
    },
    "unit-converter": {
      name: "Engineering Unit Converter",
      description: "Convert engineering units and check the scale of a result in a worked example.",
      sections: [
        {
          heading: "Check a familiar conversion",
          text: "Choose the starting and target units for the same physical quantity, then enter a value. Try converting 1 m to millimetres, which should give 1,000 mm. Reverse the conversion and use that result as the input to recover the original value."
        }
      ]
    }
  };

  const source = window.FIELD_CATALOG;
  const localise = (items, translations) => items.map(item => ({
    ...item,
    ...translations[item.id]
  }));
  window.FIELD_CATALOG_EN = {
    topics: localise(source.topics, topics),
    notes: localise(source.notes, notes),
    projects: localise(source.projects, projects)
  };
})();
