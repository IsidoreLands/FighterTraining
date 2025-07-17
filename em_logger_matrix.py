# em_logger_matrix.py

import json

# Function to load aircraft schema JSON (contains specific amounts and units)
def load_aircraft_schema(schema_path):
    with open(schema_path, 'r') as f:
        return json.load(f)

# Function to load external log JSON
def load_external_log(log_path):
    with open(log_path, 'r') as f:
        return json.load(f)

# Function to derive Set B from provided vars (T, D, W, V, ẇ_f, w_f, V_ts, ẇ_c, W_f, x)
def derive_set_b_from_matrix(schema, log):
    # Extract from schema and log (assume schema has statics, log has dynamics)
    T = log.get('T', schema.get('T', 0))
    D = log.get('D', schema.get('D', 0))
    W = log.get('W', schema.get('W', 0))
    V = log.get('V', schema.get('V', 0))
    ẇ_f = log.get('ẇ_f', schema.get('ẇ_f', 0))
    w_f = log.get('w_f', schema.get('w_f', 0))
    V_ts = log.get('V_ts', schema.get('V_ts', V))  # Default to V if not specified
    ẇ_c = log.get('ẇ_c', schema.get('ẇ_c', ẇ_f))  # Default to ẇ_f
    W_f = log.get('W_f', schema.get('W_f', w_f))
    x = log.get('x', schema.get('x', 0))
    
    # Derive P_s = (T - D)/W * V
    P_s = ((T - D) / W) * V if W != 0 else 0
    
    # Derive E_ME = P_s_star / ẇ_f * w_f (assume P_s_star approx P_s for simplicity)
    P_s_star = P_s  # Or average from log if available
    E_ME = (P_s_star / ẇ_f * w_f) if ẇ_f != 0 else 0
    
    # Derive R = V_ts / ẇ_c * W_f + x
    R = ((V_ts / ẇ_c) * W_f + x) if ẇ_c != 0 else x
    
    return {'P_s': P_s, 'E_ME': E_ME, 'R': R}
