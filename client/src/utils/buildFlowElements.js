export const buildFlowElements = (workflowData, direction = 'vertical') => {
  const nodes = [];
  const edges = [];

  const isVertical = direction !== 'horizontal';

  const phaseSpacingX = 320;
  const taskSpacingY = 120;

  const phaseSpacingY = 220;
  const taskSpacingX = 300;

  // ROOT NODE
  nodes.push({
    id: "root",
    type: "workflowNode",
    position: isVertical ? { x: 1000, y: 50 } : { x: 50, y: 650 },
    data: {
      label: workflowData.root?.label || "workflow",
      direction: direction
    }
  });

  workflowData.root?.children?.forEach((phase, phaseIndex) => {
    let phaseX, phaseY;
    if (isVertical) {
      phaseX = 200 + phaseIndex * phaseSpacingX;
      phaseY = 250;
    } else {
      phaseX = 350;
      phaseY = 100 + phaseIndex * phaseSpacingY;
    }

    // PHASE NODE
    nodes.push({
      id: phase.id,
      type: "phaseNode",
      position: {
        x: phaseX,
        y: phaseY
      },
      data: {
        label: phase.label,
        color: phase.color || "#e40b7f",
        direction: direction
      }
    });

    // ROOT -> PHASE EDGE
    edges.push({
      id: `e-root-${phase.id}`,
      source: "root",
      target: phase.id,
      animated: true,
      style: {
        stroke: phase.color || "#e40b7f",
        strokeWidth: 2
      }
    });

    // TASK NODES
    phase.children?.forEach((task, taskIndex) => {
      const taskId = `${phase.id}-${task.id}`;

      let taskX, taskY;
      if (isVertical) {
        taskX = phaseX;
        taskY = phaseY + 180 + (taskIndex * taskSpacingY);
      } else {
        taskX = phaseX + 240 + (taskIndex * taskSpacingX);
        taskY = phaseY;
      }

      nodes.push({
        id: taskId,
        type: "taskNode",
        position: {
          x: taskX,
          y: taskY
        },
        data: {
          label: task.label,
          details: task.details || "No details available",
          tools: task.tools || [],
          features: task.features || [],
          databaseTables: task.databaseTables || [],
          apiEndpoints: task.apiEndpoints || [],
          testingTools: task.testingTools || [],
          deploymentTools: task.deploymentTools || [],
          phaseName: phase.label,
          direction: direction,
          color: phase.color || "#e40b7f"
        }
      });

      // PHASE -> TASK EDGE
      edges.push({
        id: `e-${phase.id}-${taskId}`,
        source: phase.id,
        target: taskId,
        animated: true,
        style: {
          stroke: "#ffffff55",
          strokeDasharray: "5 5",
          strokeWidth: 1.5
        }
      });
    });
  });

  return { nodes, edges };
};
