# main_em.py

# Import other modules
import em_logger
import em_logged_units
import em_logger_matrix

# Central hub function to derive info and provide to other scripts
def main_hub(operation, **kwargs):
    if operation == 'derive_set_b_from_one':
        return em_logger.derive_set_b_from_one(kwargs['snapshot'], kwargs['known_var'], kwargs['known_value'])
    
    elif operation == 'derive_set_c_from_set_b':
        return em_logger.derive_set_c_from_set_b(kwargs['set_b'], kwargs.get('additional_params', {}))
    
    elif operation == 'derive_set_c_from_set_a':
        return em_logger.derive_set_c_from_set_a(kwargs['set_a'])
    
    elif operation == 'convert_to_standard':
        return em_logged_units.convert_to_standard(kwargs['var_name'], kwargs['value'], kwargs['current_unit'])
    
    elif operation == 'convert_set_a_to_standard':
        return em_logged_units.convert_set_a_to_standard(kwargs['set_a_with_units'])
    
    elif operation == 'derive_set_b_from_matrix':
        schema = em_logger_matrix.load_aircraft_schema(kwargs['schema_path'])
        log = em_logger_matrix.load_external_log(kwargs['log_path'])
        return em_logger_matrix.derive_set_b_from_matrix(schema, log)
    
    else:
        raise ValueError("Unknown operation")

# Example usage (for real-time, call from other scripts)
if __name__ == "__main__":
    # Sample call (replace with real kwargs)
    result = main_hub('derive_set_b_from_matrix', schema_path='aircraft.json', log_path='log.json')
    print(result)
