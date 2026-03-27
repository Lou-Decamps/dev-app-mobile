/**
 * @fileoverview Graphical component for task allocation by status.
 */
import { STATUS_COLORS } from "../constants/statusColors";

/**
 * Displays an SVG pie chart showing the distribution of tasks by status,
 * accompanied by a color-coded key. Each slice corresponds to a status
 * of TaskStatus. Statuses without tasks are not displayed.
 * Returns null if no tasks exist.
 * @param {Object} props
 * @param {Object[]} props.tasks - All tasks (unfiltered)
 */
function pointOnCircle(cx, cy, r, angle) {
    return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
    };
}

function slicePath(cx, cy, r, startAngle, endAngle) {
    const start = pointOnCircle(cx, cy, r, startAngle);
    const end   = pointOnCircle(cx, cy, r, endAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return [
        `M ${cx} ${cy}`,
        `L ${start.x} ${start.y}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        "Z",
    ].join(" ");
}

export default function PieChart({ tasks }) {
    const cx = 60;  // centre x
    const cy = 60;  // centre y
    const r  = 50;  // rayon

    const slices = Object.entries(STATUS_COLORS)
        .map(([status, color]) => ({
            label: status,
            count: tasks.filter((t) => t.status === status).length,
            color,
        }))
        .filter((s) => s.count > 0);

    const total = tasks.length;

    if (total === 0) return null;

    let currentAngle = -Math.PI / 2;

    const slicesWithAngles = slices.map((slice) => {
        const startAngle = currentAngle;
        const sliceAngle = (slice.count / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        currentAngle = endAngle;

        return { ...slice, startAngle, endAngle };
    });

    return (
        <div className="pie-chart">
            <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="pie-chart__svg"
            >
                {slicesWithAngles.map((slice) => (
                    <path
                        key={slice.label}
                        d={slicePath(cx, cy, r, slice.startAngle, slice.endAngle)}
                        fill={slice.color}
                        stroke="white"
                        strokeWidth="1.5"
                    >
                        <title>{slice.label} : {slice.count} tâche(s)</title>
                    </path>
                ))}
            </svg>

            <ul className="pie-chart__legend">
                {slicesWithAngles.map((slice) => (
                    <div key={slice.label} className="pie-chart__legend-item">
                        <span
                            className="pie-chart__legend-dot"
                            style={{ backgroundColor: slice.color }}
                        />
                        <span className="pie-chart__legend-label">
                            {slice.label}
                        </span>
                        <span className="pie-chart__legend-count">
                            {slice.count}
                        </span>
                    </div>
                ))}
            </ul>
        </div>
    );
}