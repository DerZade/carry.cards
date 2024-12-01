export const DEFAULT_COLORS = [
    '#F2C14E',
    '#23395B',
    '#7E6551',
    '#86A397',
    '#1B512D',
    '#44355B',
    '#5C9EAD',
    '#A31621',
    '#EE5622',
    '#993955',
    '#595A4A',
    '#7C3626',
    '#034748',
    '#001021',
    '#2D728F',
    '#7B0828',
    '#4D685A',
    '#0B3948',
];

export function randomColor() {
    return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]!;
}
