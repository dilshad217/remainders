/**
 * Wallpaper Generation API Route
 * 
 * This API endpoint generates a dynamic wallpaper image using @vercel/og.
 * It accepts user parameters via URL query string and renders a visualization
 * of life progress as boxes on a grid - inspired by thelifecalendar.com
 * 
 * Features:
 * - Two view modes: Year (52 weeks with month labels) and Life (4160 weeks with year labels)
 * - Device-responsive box sizing
 * - Dark background with white boxes for past weeks, gray outline for future
 * - Month/Year labels on the left side
 * - Clean, minimalist design
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import {
  calculateWeeksLived,
  calculateLifePercentage,
  calculateWeeksInCurrentYear,
  getCurrentDayOfYear,
  calculateDaysLeftInYear,
  getTotalDaysInCurrentYear,
  TOTAL_WEEKS,
  WEEKS_PER_YEAR,
} from '@/lib/calcs';

// Configure this route as dynamic (not static) and allow larger images
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const birthDate = searchParams.get('birthDate');
    const themeColor = searchParams.get('themeColor') || 'FF6B35';
    const width = parseInt(searchParams.get('width') || '1170');
    const height = parseInt(searchParams.get('height') || '2532');
    const viewMode = searchParams.get('viewMode') || 'life';

    // Validate required parameters
    if (viewMode === 'life' && !birthDate) {
      return new Response('Missing birthDate parameter for Life View', { status: 400 });
    }

    // Calculate life progress metrics (only needed for Life View)
    let weeksLived = 0;
    let lifePercentage = 0;
    let birth = new Date();
    
    if (viewMode === 'life' && birthDate) {
      weeksLived = calculateWeeksLived(birthDate);
      lifePercentage = calculateLifePercentage(weeksLived);
      birth = new Date(birthDate);
    }
    
    const currentYear = new Date().getFullYear();

    // Determine which view to render and calculate progress
    let totalBoxesToShow: number;
    let boxesToHighlight: number;
    let labels: string[] = [];
    let daysLeftText = '';

    if (viewMode === 'year') {
      // Year View: Show all days of current year (365 or 366)
      totalBoxesToShow = getTotalDaysInCurrentYear();
      boxesToHighlight = getCurrentDayOfYear();
      const daysLeft = calculateDaysLeftInYear();
      daysLeftText = `${daysLeft}d left`;
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    } else {
      // Life View: Show all 4160 weeks with year labels (every 5 years)
      totalBoxesToShow = TOTAL_WEEKS;
      boxesToHighlight = weeksLived;
      daysLeftText = `${lifePercentage}% to 90`;
      
      // Generate year labels (birth year + every 5 years)
      const birthYear = birth.getFullYear();
      for (let age = 0; age <= 80; age += 5) {
        labels.push((birthYear + age).toString());
      }
    }

    /**
     * Calculate grid layout
     * - Life View: 52 columns × 80 rows = 4160 weeks
     * - Year View: Variable columns × 12 rows for days (organized by month)
     */
    const columns = viewMode === 'year' ? Math.ceil(totalBoxesToShow / 12) : 52;
    const rows = viewMode === 'year' ? 12 : 80; // 12 months or 80 years

    /**
     * Calculate responsive box size
     */
    const labelWidth = 60; // Space for year/month labels on the left
    const bottomTextHeight = 100;
    const topPadding = 60;
    const sidePadding = 40;
    
    const availableWidth = width - labelWidth - sidePadding * 2;
    const availableHeight = height - bottomTextHeight - topPadding - 40;

    // Calculate box size based on available space
    const boxSizeByWidth = availableWidth / (columns * 1.3); // 1.3 = box + gap ratio
    const boxSizeByHeight = availableHeight / (rows * 1.3);
    const boxSize = Math.min(boxSizeByWidth, boxSizeByHeight, 10);
    const gap = boxSize * 0.3;

    /**
     * Calculate grid positioning
     */
    const gridWidth = columns * boxSize + (columns - 1) * gap;
    const gridHeight = rows * boxSize + (rows - 1) * gap;
    const startX = labelWidth + (width - labelWidth - gridWidth) / 2;
    const startY = topPadding + (height - bottomTextHeight - topPadding - gridHeight) / 2;

    /**
     * Generate boxes for the grid
     */
    const boxes = [];
    const labelElements = [];

    if (viewMode === 'year') {
      // Year View: 12 rows (months) with actual days per month
      const currentYear = new Date().getFullYear();
      const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
      const daysPerMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let dayIndex = 0;
      
      for (let month = 0; month < 12; month++) {
        const row = month;
        const daysInMonth = daysPerMonth[month];
        
        // Add month label
        labelElements.push(
          <div
            key={`label-${month}`}
            style={{
              position: 'absolute',
              left: sidePadding,
              top: startY + row * (boxSize + gap) * (80 / 12),
              fontSize: Math.max(boxSize * 1.2, 10),
              color: '#666',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {labels[month]}
          </div>
        );
        
        // Add boxes for each day in this month
        for (let day = 0; day < daysInMonth; day++) {
          const col = day % columns;
          const x = startX + col * (boxSize + gap);
          const y = startY + row * (boxSize + gap) * (80 / 12);
          
          const isPast = dayIndex < boxesToHighlight;
          
          boxes.push(
            <rect
              key={dayIndex}
              x={x}
              y={y}
              width={boxSize}
              height={boxSize}
              rx={boxSize * 0.15}
              fill={isPast ? '#FFFFFF' : 'transparent'}
              stroke={isPast ? 'transparent' : '#3a3a3a'}
              strokeWidth={boxSize * 0.1}
            />
          );
          
          dayIndex++;
        }
      }
    } else {
      // Life View: 80 rows (years) × 52 weeks per year
      for (let year = 0; year < 80; year++) {
        // Add year label every 5 years
        if (year % 5 === 0) {
          const labelIndex = year / 5;
          labelElements.push(
            <div
              key={`label-${year}`}
              style={{
                position: 'absolute',
                left: sidePadding,
                top: startY + year * (boxSize + gap),
                fontSize: Math.max(boxSize * 1.2, 8),
                color: '#666',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {labels[labelIndex]}
            </div>
          );
        }
        
        // Add 52 boxes for each year
        for (let week = 0; week < 52; week++) {
          const weekIndex = year * 52 + week;
          const x = startX + week * (boxSize + gap);
          const y = startY + year * (boxSize + gap);
          
          const isPast = weekIndex < boxesToHighlight;
          
          boxes.push(
            <rect
              key={weekIndex}
              x={x}
              y={y}
              width={boxSize}
              height={boxSize}
              rx={boxSize * 0.15}
              fill={isPast ? '#FFFFFF' : 'transparent'}
              stroke={isPast ? 'transparent' : '#3a3a3a'}
              strokeWidth={boxSize * 0.1}
            />
          );
        }
      }
    }

    /**
     * Format statistics text
     * - Year View: Shows days left
     * - Life View: Shows percentage
     */
    const statsText = daysLeftText;

    /**
     * Return ImageResponse with clean design
     */
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            position: 'relative',
          }}
        >
          {/* Year/Month labels */}
          {labelElements}

          {/* Grid container */}
          <svg
            width={width}
            height={height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {boxes}
          </svg>

          {/* Statistics text at the bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: `#${themeColor}`,
              fontSize: Math.max(width * 0.04, 24),
              fontWeight: 500,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {statsText}
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    console.error('Error generating wallpaper:', error);
    return new Response('Error generating wallpaper', { status: 500 });
  }
}
