# em_logged_units.py

# Dictionary of standard military units for Set A variables
STANDARD_UNITS = {
    'r': 'ft',
    'V': 'ft/sec',
    'g': 'ft/sec²',
    'N_r': 'dimensionless',
    'ω': 'rad/sec',
    'q': 'lb/ft²',
    'ρ': 'slugs/ft³',
    'E': 'ft-lb',
    'W': 'lb',
    'h': 'ft',
    'm': 'slugs',
    'E_s': 'ft',
    'P_s': 'ft/sec',
    'T': 'lb',
    'D': 'lb',
    'Ṅ': 'ft/sec²',
    'γ': 'rad',
    'ḣ': 'ft/sec',
    'E_ME': 'ft',
    'P_s_star': 'ft/sec',
    'ẇ_f': 'lb/sec',
    'w_f': 'lb',
    'R': 'nautical miles',
    'V_ts': 'ft/sec',
    'ẇ_c': 'lb/sec',
    'W_f': 'lb',
    'x': 'nautical miles',
    'C_D': 'dimensionless',
    'C_D0': 'dimensionless',
    'k': 'dimensionless',
    'C_L': 'dimensionless',
    'S': 'ft²',
    'C_L_max': 'dimensionless',
    'n_L': 'dimensionless'
}

# Conversion factors (example; extend as needed)
CONVERSION_FACTORS = {
    'ft to m': 0.3048,
    'm to ft': 3.28084,
    'kt to ft/sec': 1.68781,
    'ft/sec to kt': 0.592484,
    # Add more for other units like mph, km, etc.
}

# Function to convert a variable's value to standard unit
def convert_to_standard(var_name, value, current_unit):
    if var_name not in STANDARD_UNITS:
        raise ValueError(f"Unknown variable: {var_name}")
    
    std_unit = STANDARD_UNITS[var_name]
    if current_unit == std_unit:
        return value
    
    # Implement conversions (placeholder; add logic for each possible)
    key = f'{current_unit} to {std_unit}'
    if key in CONVERSION_FACTORS:
        return value * CONVERSION_FACTORS[key]
    else:
        raise ValueError(f"No conversion from {current_unit} to {std_unit} for {var_name}")

# Function to convert entire Set A dict to standard units
def convert_set_a_to_standard(set_a_with_units):
    # set_a_with_units = {var: {'value': val, 'unit': unit}, ...}
    converted = {}
    for var, data in set_a_with_units.items():
        converted[var] = convert_to_standard(var, data['value'], data['unit'])
    return converted
