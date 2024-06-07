import React from 'react';

const PressureGaugeSVG = ({ rotation, pressure }: { rotation: number, pressure: number }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            width="150"
            height="150"
            className="pressure-gauge"
        >
            {/* Полукруговая шкала */}
            <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                stroke="#ccc"
                strokeWidth="5"
                fill="none"
            />

            {/* Отметки на шкале */}
            {[...Array(19)].map((_, i) => (
                <line
                    key={i}
                    x1="50"
                    y1="10"
                    x2="50"
                    y2="15"
                    stroke="#ccc"
                    strokeWidth="2"
                    transform={`rotate(${i * 10 - 90}, 50, 50)`}
                />
            ))}

            {/* Указатель */}
            <line
                style={{
                    stroke: pressure < 1000
                        ? "#ff0000"
                        : pressure >= 1000 && pressure < 1015
                            ? "#ff6600"
                            : pressure >= 1015 && pressure < 1025
                                ? "#ffcc00"
                                : pressure >= 1025 && pressure < 1040
                                    ? "#00cc00"
                                    : pressure >= 1040
                                        ? "#009900"
                                        : "#ccc",
                    transition: 'transform 0.5s ease-in-out'
                }}
                x1="50"
                y1="50"
                x2="50"
                y2="15"
                stroke="#ff0000" // Красный цвет для стрелки
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${rotation}, 50, 50)`}

            />

            {/* Центр указателя */}
            <circle cx="50" cy="50" r="2" fill="#333" />

            {/* Текущее значение давления */}
            <text
                x="50"
                y="70"
                textAnchor="middle"
                fontSize="12"
                fill="#333"
            >
                {pressure} мм рт. ст.
            </text>
        </svg>
    );
};

export default PressureGaugeSVG;
