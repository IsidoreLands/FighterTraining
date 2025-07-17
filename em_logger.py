# em_logger.py

# Set A variables list for reference (no hardcoded amounts)
SET_A_VARS = [
    'r', 'V', 'g', 'N_r', 'ω', 'q', 'ρ', 'E', 'W', 'h', 'm', 'E_s', 
    'P_s', 'T', 'D', 'Ṅ', 'γ', 'ḣ', 'E_ME', 'P_s_star', 'ẇ_f', 'w_f', 
    'R', 'V_ts', 'ẇ_c', 'W_f', 'x', 'C_D', 'C_D0', 'k', 'C_L', 'S', 
    'C_L_max', 'n_L'
]

# Set B variables
SET_B = ['P_s', 'E_ME', 'R']

# Function to derive full Set B knowing one and the encoded snapshot (P, Q, T)
def derive_set_b_from_one(snapshot, known_var, known_value):
    P, Q, T = snapshot.get('p'), snapshot.get('q'), snapshot.get('t')
    if not all([P, Q, T]):
        raise ValueError("Snapshot must contain 'p', 'q', 't'")
    if known_var not in SET_B:
        raise ValueError(f"Known var must be one of {SET_B}")
    
    if known_var == 'R':
        P_s = T - known_value
        E_ME = Q - known_value
        verify = P_s + E_ME == P
    elif known_var == 'P_s':
        E_ME = P - known_value
        R = T - known_value
        verify = E_ME + R == Q
    elif known_var == 'E_ME':
        P_s = P - known_value
        R = Q - known_value
        verify = P_s + R == T
    
    if not verify:
        raise ValueError("Verification failed; inconsistent data")
    
    return {'P_s': P_s if known_var != 'P_s' else known_value,
            'E_ME': E_ME if known_var != 'E_ME' else known_value,
            'R': R if known_var != 'R' else known_value}

# Function to derive Set C from Set B (requires additional params like aircraft specs)
def derive_set_c_from_set_b(set_b, additional_params):
    # Set C is Set A minus Set B
    P_s, E_ME, R = set_b['P_s'], set_b['E_ME'], set_b['R']
    
    # Example derivations (placeholder; in real use, implement full EM equations with params)
    # Assume additional_params provides V, W, g, etc.
    V = additional_params.get('V', 0)
    W = additional_params.get('W', 0)
    g = additional_params.get('g', 32.174)
    
    # Derive sample vars (simplified)
    T = additional_params.get('T', P_s * W / V + additional_params.get('D', 0))  # From P_s = (T - D)/W * V
    D = additional_params.get('D', 0)
    h = additional_params.get('h', (E_ME / 10) - (V**2 / (2 * g)))  # Simplified
    # ... Implement full derivations as needed
    
    set_c = {
        'T': T,
        'D': D,
        'h': h,
        # Add all other Set C vars similarly
    }
    return set_c

# Function to derive Set C from Set A (extract Set B then derive, or directly compute missing)
def derive_set_c_from_set_a(set_a):
    # Extract Set B from Set A if present, else raise error
    set_b = {k: set_a[k] for k in SET_B if k in set_a}
    if len(set_b) != 3:
        raise ValueError("Set A must contain all of Set B")
    
    # Derive Set C as Set A minus Set B (assuming Set A is complete)
    set_c = {k: v for k, v in set_a.items() if k not in SET_B}
    return set_c
