import React from 'react';
import { useTheme } from 'next-themes';

const PressureGaugeSVG = ({ rotation, pressure }: { rotation: number, pressure: number }) => {
    const { theme } = useTheme();

    // Логика выбора цвета стрелки в зависимости от давления
    const getPressureColor = (pressure: number) => {
        if (pressure < 1000) return "#ff0000"; // Очень низкое давление
        if (pressure >= 1000 && pressure < 1015) return "#ff6600"; // Низкое давление
        if (pressure >= 1015 && pressure < 1025) return "#ffcc00"; // Нормальное давление
        if (pressure >= 1025 && pressure < 1040) return "#00cc00"; // Высокое давление
        if (pressure >= 1040) return "#009900"; // Очень высокое давление
        return "#ccc"; // По умолчанию
    };

    // Цвет для разных тем
    const gaugeColor = theme === 'dark' ? '#aaa' : '#333';
    const textColor = theme === 'dark' ? '#fff' : '#333';

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
                stroke={gaugeColor}
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
                    stroke={gaugeColor}
                    strokeWidth="2"
                    transform={`rotate(${i * 10 - 90}, 50, 50)`}
                />
            ))}

            {/* Указатель */}
            <line
                x1="50"
                y1="50"
                x2="50"
                y2="15"
                stroke={getPressureColor(pressure)}
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${rotation}, 50, 50)`}
                style={{
                    transition: 'transform 0.5s ease-in-out',
                }}
            />

            {/* Центр указателя */}
            <circle cx="50" cy="50" r="2" fill={gaugeColor} />

            {/* Текущее значение давления */}
            <text
                x="50"
                y="70"
                textAnchor="middle"
                fontSize="12"
                fill={textColor}
            >
                {pressure} мм рт. ст.
            </text>
        </svg>
    );
};

export default PressureGaugeSVG;
