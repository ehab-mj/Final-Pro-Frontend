export function getProductSpecs(product) {
    const specs = product.specifications || {};
    const parts = [];

    if (product.brand) parts.push(product.brand);
    if (specs.socket) parts.push(specs.socket);
    if (specs.cores) parts.push(`${specs.cores} Cores`);
    if (specs.boostClock) parts.push(specs.boostClock);
    if (specs.ramType) parts.push(specs.ramType);
    if (specs.vram) parts.push(`${specs.vram}GB VRAM`);
    if (specs.capacityGb) parts.push(`${specs.capacityGb}GB`);
    if (specs.wattage) parts.push(`${specs.wattage}W`);
    if (specs.formFactor) parts.push(specs.formFactor);
    if (specs.tdp) parts.push(`${specs.tdp}W TDP`);

    return parts.join(' • ') || product.description || 'No specifications available';
}