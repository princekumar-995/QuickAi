import React from "react";
import { Handle, Position } from "@xyflow/react";

function TaskNode({ data }) {
  const isVertical = data.direction !== 'horizontal';
  const borderColor = data.color || '#e40b7f';

  return (
    <div
      className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
      style={{
        width: 220,
        background: "#09090D",
        border: `2px solid ${borderColor}`,
        color: "white",
        boxShadow: `0 0 15px ${borderColor}25`
      }}
    >
      <h3
        style={{
          fontSize: "12px",
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: "0.025em",
          color: "#ffffff"
        }}
      >
        {data.label}
      </h3>

      <Handle
        type="target"
        position={isVertical ? Position.Top : Position.Left}
        style={{ background: borderColor, width: 6, height: 6 }}
      />

      <Handle
        type="source"
        position={isVertical ? Position.Bottom : Position.Right}
        style={{ background: borderColor, width: 6, height: 6 }}
      />
    </div>
  );
}

export default TaskNode;
