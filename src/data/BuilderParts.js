import {
    Cpu,
    MemoryStick,
    Gauge,
    HardDrive,
    Box,
    ShieldCheck,
} from 'lucide-react';

export const parts = [
    { key: 'cpu', category: 'CPU', label: 'CPU', icon: Cpu },
    { key: 'motherboard', category: 'Motherboard', label: 'Motherboard', icon: Gauge },
    { key: 'ram', category: 'RAM', label: 'RAM', icon: MemoryStick },
    { key: 'gpu', category: 'GPU', label: 'GPU', icon: Gauge },
    { key: 'storage', category: 'Storage', label: 'Storage', icon: HardDrive },
    { key: 'case', category: 'Case', label: 'Case', icon: Box },
    { key: 'psu', category: 'PSU', label: 'Power Supply', icon: ShieldCheck },
];