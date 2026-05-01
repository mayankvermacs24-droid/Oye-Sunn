import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius } from '../theme/typography';

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS = ['AM', 'PM'];

function formatTimeString(hIdx, mIdx, pIdx) {
  const h = HOURS[hIdx] ?? 12;
  const m = MINUTES[mIdx] ?? 0;
  const p = PERIODS[pIdx] ?? 'AM';
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${p}`;
}

/**
 * ScrollColumn — fully uncontrolled. Receives initialIndex once,
 * manages its own state, and only calls onValueChange outward.
 * Parent NEVER passes selected index back in — no feedback loop possible.
 */
function ScrollColumn({ data, initialIndex, onValueChange, formatValue, label, width }) {
  const [selectedIdx, setSelectedIdx] = useState(initialIndex);
  const selectedRef = useRef(initialIndex);
  const scrollRef = useRef(null);
  const isProgrammatic = useRef(false);
  const resetTimer = useRef(null);

  // Scroll to initial position on mount
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: initialIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const updateSelection = useCallback((idx) => {
    selectedRef.current = idx;
    setSelectedIdx(idx);
    onValueChange(idx);
  }, [onValueChange]);

  const handleTap = useCallback((index) => {
    if (index === selectedRef.current) return;
    isProgrammatic.current = true;
    updateSelection(index);
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });

    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      isProgrammatic.current = false;
    }, 600);
  }, [updateSelection]);

  const handleMomentumScrollEnd = useCallback((event) => {
    if (isProgrammatic.current) {
      isProgrammatic.current = false;
      clearTimeout(resetTimer.current);
      return;
    }
    const y = event.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, data.length - 1));
    if (clamped !== selectedRef.current) {
      updateSelection(clamped);
    }
  }, [data.length, updateSelection]);

  const paddingCount = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <View style={[colStyles.wrapper, { width: width || 64 }]}>
      {label ? <Text style={colStyles.label}>{label}</Text> : <View style={{ height: 18 }} />}
      <View style={colStyles.scrollBox}>
        <View style={colStyles.band} pointerEvents="none" />
        <View style={colStyles.scrollClip}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            bounces={false}
            overScrollMode="never"
            onMomentumScrollEnd={handleMomentumScrollEnd}
            nestedScrollEnabled
            contentContainerStyle={{
              paddingTop: paddingCount * ITEM_HEIGHT,
              paddingBottom: paddingCount * ITEM_HEIGHT,
            }}
          >
            {data.map((item, index) => {
              const active = index === selectedIdx;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTap(index)}
                  activeOpacity={0.6}
                  style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={[
                    colStyles.text,
                    active && colStyles.activeText,
                    !active && colStyles.dimText,
                  ]}>
                    {formatValue ? formatValue(item) : String(item)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const colStyles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    height: 18,
  },
  scrollBox: {
    height: PICKER_HEIGHT,
    position: 'relative',
  },
  scrollClip: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT,
    left: -18,
    right: -18,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.backgroundDark,
    borderRadius: 12,
    zIndex: 0,
  },
  text: { fontSize: 20, fontWeight: '400', color: Colors.textMuted, zIndex: 1 },
  activeText: { fontSize: 22, fontWeight: '700', color: Colors.textLight },
  dimText: { opacity: 0.4 },
});


/**
 * ScrollTimePicker — uses refs for live values so that changing one column
 * never re-renders or disrupts sibling columns.
 */
export default function ScrollTimePicker({ label, value, onChange }) {
  const parseTime = (val) => {
    if (!val) return { hour: 12, minute: 0, period: 'AM' };
    const match = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      return {
        hour: parseInt(match[1], 10),
        minute: parseInt(match[2], 10),
        period: match[3].toUpperCase(),
      };
    }
    return { hour: 12, minute: 0, period: 'AM' };
  };

  const parsed = parseTime(value);
  const hourRef = useRef(Math.max(0, HOURS.indexOf(parsed.hour)));
  const minuteRef = useRef(parsed.minute);
  const periodRef = useRef(Math.max(0, PERIODS.indexOf(parsed.period)));
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [displayTime, setDisplayTime] = useState(value || '12:00 AM');

  const handleHour = useCallback((idx) => {
    hourRef.current = idx;
    const s = formatTimeString(idx, minuteRef.current, periodRef.current);
    setDisplayTime(s);
    onChangeRef.current(s);
  }, []);

  const handleMinute = useCallback((idx) => {
    minuteRef.current = idx;
    const s = formatTimeString(hourRef.current, idx, periodRef.current);
    setDisplayTime(s);
    onChangeRef.current(s);
  }, []);

  const handlePeriod = useCallback((idx) => {
    periodRef.current = idx;
    const s = formatTimeString(hourRef.current, minuteRef.current, idx);
    setDisplayTime(s);
    onChangeRef.current(s);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Ionicons name="time-outline" size={18} color={Colors.accentOrange} />
        <Text style={styles.label}>{label}</Text>
      </View>

      <Text style={styles.timeDisplay}>{displayTime}</Text>

      <View style={styles.wheels}>
        <ScrollColumn
          data={HOURS}
          initialIndex={hourRef.current}
          onValueChange={handleHour}
          formatValue={(v) => v.toString().padStart(2, '0')}
          label="Hour"
          width={88}
        />
        <View style={styles.colonWrap}>
          <Text style={styles.colon}>:</Text>
        </View>
        <ScrollColumn
          data={MINUTES}
          initialIndex={minuteRef.current}
          onValueChange={handleMinute}
          formatValue={(v) => v.toString().padStart(2, '0')}
          label="Min"
          width={88}
        />
        <View style={{ width: Spacing.md }} />
        <ScrollColumn
          data={PERIODS}
          initialIndex={periodRef.current}
          onValueChange={handlePeriod}
          width={88}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  label: { ...Typography.label, color: Colors.textDark, marginLeft: Spacing.sm },
  timeDisplay: {
    ...Typography.h2,
    color: Colors.accentOrange,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  wheels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.chipBg,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  colonWrap: { justifyContent: 'center', alignItems: 'center', paddingTop: 18 },
  colon: { fontSize: 24, fontWeight: '700', color: Colors.textDark, marginHorizontal: 2 },
});
