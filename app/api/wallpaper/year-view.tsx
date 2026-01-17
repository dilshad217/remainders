import {
    calculateDaysLeftInYear,
    getCurrentDayOfYear,
    getTotalDaysInCurrentYear,
} from '@/lib/calcs';

interface YearViewProps {
    width: number;
    height: number;
    isMondayFirst: boolean;
    yearViewLayout?: 'months' | 'days';
    daysLayoutMode?: 'calendar' | 'continuous';
}

export function YearView({ width, height, isMondayFirst, yearViewLayout = 'months', daysLayoutMode = 'continuous' }: YearViewProps) {
    // Colors Config
    const BG_COLOR = '#1a1a1a'; // Dark background
    const TEXT_COLOR = '#888888'; // Grey for text
    const PAST_COLOR = '#FFFFFF'; // White for passed days
    const ACCENT_COLOR = '#FF6B35'; // Orange for current day
    const FUTURE_COLOR = '#404040'; // Dark grey for future

    // Year Logic
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentDayOfYear = getCurrentDayOfYear();
    const daysLeft = calculateDaysLeftInYear();
    const totalDays = getTotalDaysInCurrentYear();

    // Days View Layout (weekly grid - 2 weeks per row)
    if (yearViewLayout === 'days') {
        const aspectRatio = height / width;
        
        const SAFE_AREA_TOP = aspectRatio > 2.0 ? height * 0.28 : height * 0.25;
        const SAFE_AREA_BOTTOM = height * 0.15;
        const SAFE_HEIGHT = height - SAFE_AREA_TOP - SAFE_AREA_BOTTOM;
        
        const basePaddingRatio = aspectRatio > 2.1 ? 0.12 : aspectRatio > 2.0 ? 0.15 : 0.18;
        const paddingX = width * basePaddingRatio;
        const availableWidth = width - paddingX * 2;
        
        // Calculate grid dimensions - 14 days per row (2 weeks)
        const COLS_PER_ROW = 14;
        
        // Calculate offset for calendar mode
        let startDayOffset = 0;
        if (daysLayoutMode === 'calendar') {
            // Get the day of week for January 1st
            const jan1 = new Date(currentYear, 0, 1);
            startDayOffset = jan1.getDay(); // 0 = Sunday
            
            // If Monday first, adjust the offset
            if (isMondayFirst) {
                startDayOffset = startDayOffset === 0 ? 6 : startDayOffset - 1;
            }
        }
        
        const totalCells = startDayOffset + totalDays;
        const ROWS = Math.ceil(totalCells / COLS_PER_ROW);
        
        const maxDotSizeH = availableWidth / COLS_PER_ROW;
        const maxDotSizeV = SAFE_HEIGHT / (ROWS + 2);
        const dotSize = Math.min(maxDotSizeH, maxDotSizeV) * 0.7;
        const dotGap = dotSize * 0.35;
        
        const statsFontSize = dotSize * 0.8;
        const statsMargin = dotSize * 2;
        
        const gridWidth = COLS_PER_ROW * (dotSize + dotGap) - dotGap;
        const gridHeight = ROWS * (dotSize + dotGap) - dotGap;
        
        const startX = paddingX + (availableWidth - gridWidth) / 2;
        const startY = SAFE_AREA_TOP + (SAFE_HEIGHT - gridHeight - statsMargin - statsFontSize) / 2;
        const statsY = startY + gridHeight + statsMargin;
        
        // Create all dots
        const allDots = [];
        for (let day = 1; day <= totalDays; day++) {
            let color;
            if (day < currentDayOfYear) {
                color = PAST_COLOR;
            } else if (day === currentDayOfYear) {
                color = ACCENT_COLOR;
            } else {
                color = FUTURE_COLOR;
            }
            
            // Calculate position with offset for first week
            const cellIndex = day - 1 + startDayOffset;
            const row = Math.floor(cellIndex / COLS_PER_ROW);
            const col = cellIndex % COLS_PER_ROW;
            
            allDots.push(
                <div
                    key={`dot-${day}`}
                    style={{
                        position: 'absolute',
                        left: startX + col * (dotSize + dotGap),
                        top: startY + row * (dotSize + dotGap),
                        width: dotSize,
                        height: dotSize,
                        borderRadius: '50%',
                        backgroundColor: color,
                    }}
                />
            );
        }
        
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: BG_COLOR,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%' }}>
                    {allDots}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: statsY,
                        left: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: statsFontSize,
                        fontFamily: 'monospace',
                    }}
                >
                    <span style={{ color: ACCENT_COLOR }}>{daysLeft}d left</span>
                    <span style={{ color: TEXT_COLOR, margin: '0 8px' }}>·</span>
                    <span style={{ color: TEXT_COLOR }}>{Math.round((currentDayOfYear / totalDays) * 100)}%</span>
                </div>
            </div>
        );
    }

    // Grid Layout Config (Months View)
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const COLUMNS = 3;
    const ROWS = 4;

    // --- Layout Calculations with Aspect Ratio Support ---
    // Calculate aspect ratio to adapt layout
    const aspectRatio = height / width;
    
    // 1. Safe Zones - adapt based on aspect ratio
    // Taller phones (>2.0) need more top padding
    const SAFE_AREA_TOP = aspectRatio > 2.0 ? height * 0.28 : height * 0.25;
    const SAFE_AREA_BOTTOM = height * 0.15;
    const SAFE_HEIGHT = height - SAFE_AREA_TOP - SAFE_AREA_BOTTOM;

    // 2. Horizontal Spacing - reduce padding on narrower screens
    const basePaddingRatio = aspectRatio > 2.1 ? 0.12 : aspectRatio > 2.0 ? 0.15 : 0.18;
    const paddingX = width * basePaddingRatio;
    const availableWidth = width - (paddingX * 2);
    const cellWidth = availableWidth / COLUMNS;

    // 3. Size Config - scale based on available space
    // Calculate maximum dot size that fits horizontally
    const maxDotSizeH = cellWidth / 8; // 7 dots + spacing
    // Calculate maximum dot size that fits vertically
    const maxMonthBlockHeight = SAFE_HEIGHT / ROWS;
    const maxDotSizeV = maxMonthBlockHeight / 9; // Labels + 6 rows of dots + gaps
    
    const dotSize = Math.min(maxDotSizeH, maxDotSizeV, 20);
    const dotGap = dotSize * 0.7;
    const monthLabelSize = dotSize * 1.6;

    // 4. Vertical Calculation
    const monthBlockHeight = monthLabelSize + dotSize + (6 * dotSize) + (5 * dotGap);
    const rowGap = monthLabelSize * 1.0;

    // Stats Text Config
    const statsFontSize = monthLabelSize;
    const statsMargin = rowGap * 3.0; // Reduced from 4.0 for tighter spacing

    const gridHeight = (ROWS * monthBlockHeight) + ((ROWS - 1) * rowGap);
    const totalContentHeight = gridHeight + statsMargin + statsFontSize;

    // 5. Centering with bounds checking
    const calculatedStartY = SAFE_AREA_TOP + ((SAFE_HEIGHT - totalContentHeight) / 2);
    const startY = Math.max(SAFE_AREA_TOP * 0.9, calculatedStartY); // Ensure minimum top margin
    const statsY = startY + gridHeight + statsMargin;

    // Helper to get days in month
    const getDaysInMonth = (year: number, monthIndex: number) => {
        return new Date(year, monthIndex + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, monthIndex: number) => {
        if (isMondayFirst) {
            const day = new Date(year, monthIndex, 1).getDay();
            return (day === 0 ? 6 : day - 1);
        }
        return new Date(year, monthIndex, 1).getDay(); // 0 = Sun, etc.
    };

    let globalDayCounter = 0;

    // Build the grid
    const monthCells = MONTHS.map((monthName, monthIndex) => {
        const daysInMonth = getDaysInMonth(currentYear, monthIndex);
        const startDay = getFirstDayOfMonth(currentYear, monthIndex); // 0-6

        const dots = [];

        // We render a 7x6 grid
        for (let i = 0; i < 42; i++) {
            const dayNum = i - startDay + 1;
            let color = 'transparent';

            if (dayNum > 0 && dayNum <= daysInMonth) {
                globalDayCounter++;
                if (globalDayCounter < currentDayOfYear) {
                    color = PAST_COLOR;
                } else if (globalDayCounter === currentDayOfYear) {
                    color = ACCENT_COLOR;
                } else {
                    color = FUTURE_COLOR;
                }
            }

            if (dayNum > 0 && dayNum <= daysInMonth) {
                const row = Math.floor(i / 7);
                const col = i % 7;

                dots.push(
                    <div
                        key={`dot-${monthIndex}-${i}`}
                        style={{
                            position: 'absolute',
                            left: col * (dotSize + dotGap),
                            top: row * (dotSize + dotGap),
                            width: dotSize,
                            height: dotSize,
                            borderRadius: '50%',
                            backgroundColor: color,
                        }}
                    />
                );
            }
        }

        // Position of month cell
        const colIndex = monthIndex % COLUMNS;
        const rowIndex = Math.floor(monthIndex / COLUMNS);

        const x = paddingX + (colIndex * cellWidth);
        const y = startY + (rowIndex * (monthBlockHeight + rowGap));
        
        // Center dot grid within cell
        const dotGridWidth = (7 * dotSize) + (6 * dotGap);
        const centerOffset = Math.max(0, (cellWidth - dotGridWidth) / 2);

        return (
            <div
                key={monthName}
                style={{
                    position: 'absolute',
                    left: x + centerOffset,
                    top: y,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{
                    color: TEXT_COLOR,
                    fontSize: monthLabelSize,
                    marginBottom: dotSize,
                    fontFamily: 'monospace',
                    display: 'flex'
                }}>
                    {monthName}
                </div>
                <div style={{ position: 'relative', width: 7 * (dotSize + dotGap), height: 6 * (dotSize + dotGap), display: 'flex' }}>
                    {dots}
                </div>
            </div>
        );
    });

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: BG_COLOR,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%' }}>
                {monthCells}
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: statsY,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: statsFontSize,
                    fontFamily: 'monospace',
                }}
            >
                <span style={{ color: ACCENT_COLOR }}>{daysLeft}d left</span>
                <span style={{ color: TEXT_COLOR, margin: '0 8px' }}>·</span>
                <span style={{ color: TEXT_COLOR }}>{Math.round((currentDayOfYear / totalDays) * 100)}%</span>
            </div>
        </div>
    );
}
