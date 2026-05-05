export function checkCompat(selectedParts) {
    const issues = [];

    const cpu = selectedParts.cpu;
    const motherboard = selectedParts.motherboard;
    const ram = selectedParts.ram;
    const gpu = selectedParts.gpu;
    const pcCase = selectedParts.case;
    const psu = selectedParts.psu;

    const getText = (product) => {
        const specs = product?.specifications || {};

        return [
            product?.name,
            product?.brand,
            product?.description,
            specs.socket,
            specs.chipset,
            specs.ramType,
            specs.ram_type,
            specs.type,
            specs.memoryType,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
    };

    const getSocket = (product) => {
        const specs = product?.specifications || {};
        const text = getText(product);

        if (specs.socket) return String(specs.socket).toUpperCase();

        if (text.includes('lga1700') || text.includes('z790') || text.includes('b760')) {
            return 'LGA1700';
        }

        if (text.includes('am5') || text.includes('b650') || text.includes('x670')) {
            return 'AM5';
        }

        if (text.includes('am4') || text.includes('b550') || text.includes('x570')) {
            return 'AM4';
        }

        return null;
    };

    const getRamType = (product) => {
        const specs = product?.specifications || {};
        const text = getText(product);

        if (specs.ramType) return String(specs.ramType).toUpperCase();
        if (specs.ram_type) return String(specs.ram_type).toUpperCase();
        if (specs.memoryType) return String(specs.memoryType).toUpperCase();
        if (specs.type === 'DDR4' || specs.type === 'DDR5') return specs.type;

        if (text.includes('ddr5')) return 'DDR5';
        if (text.includes('ddr4')) return 'DDR4';

        return null;
    };

    const getNumber = (product, keys) => {
        const specs = product?.specifications || {};

        for (const key of keys) {
            if (specs[key] !== undefined && specs[key] !== null) {
                return Number(specs[key]);
            }
        }

        return 0;
    };

    if (cpu && motherboard) {
        const cpuSocket = getSocket(cpu);
        const motherboardSocket = getSocket(motherboard);

        if (cpuSocket && motherboardSocket && cpuSocket !== motherboardSocket) {
            issues.push({
                severity: 'error',
                title: 'Compatibility Issue',
                message: `CPU socket ${cpuSocket} does not match Motherboard socket ${motherboardSocket}.`,
            });
        }
    }

    if (ram && motherboard) {
        const ramType = getRamType(ram);
        const motherboardRamType = getRamType(motherboard);

        if (ramType && motherboardRamType && ramType !== motherboardRamType) {
            issues.push({
                severity: 'error',
                title: 'Compatibility Issue',
                message: `RAM type ${ramType} does not match Motherboard RAM type ${motherboardRamType}.`,
            });
        }
    }

    if (gpu && pcCase) {
        const gpuLength = getNumber(gpu, ['lengthMm', 'length_mm']);
        const maxGpuLength = getNumber(pcCase, [
            'maxGpuLengthMm',
            'max_gpu_length_mm',
            'maxGpuLength',
        ]);

        if (gpuLength && maxGpuLength && gpuLength > maxGpuLength) {
            issues.push({
                severity: 'error',
                title: 'Compatibility Issue',
                message: `GPU length ${gpuLength}mm exceeds case limit ${maxGpuLength}mm.`,
            });
        }
    }

    if (cpu && gpu && psu) {
        const cpuTdp = getNumber(cpu, ['tdp']);
        const gpuTdp = getNumber(gpu, ['tdp']);
        const psuWattage = getNumber(psu, ['wattage']);

        const recommendedPower = Math.ceil((cpuTdp + gpuTdp + 150) * 1.3);

        if (psuWattage && recommendedPower && psuWattage < recommendedPower) {
            issues.push({
                severity: 'warning',
                title: 'Power Warning',
                message: `PSU may be too weak. Recommended ${recommendedPower}W or higher.`,
            });
        }
    }

    return issues;
}