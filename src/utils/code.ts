export function getCodeType(format: BarcodeFormat) {
    return ['aztec', 'data_matrix', 'maxi_code', 'micro_qr_code', 'qr_code', 'rm_qr_code', 'matrix_codes'].includes(format) ? 'qr' : 'bar';
}
