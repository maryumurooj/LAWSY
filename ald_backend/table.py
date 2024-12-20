import mysql.connector

# Connect to slave database (destination)
slave_db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Areesha1$",
    database="ald"
)

slave_cursor = slave_db.cursor()

# List of all tables to update
table_order = [
    'advocate', 'articles', 'bareact', 'bareactammendment', 'bareactchapterindex', 'bareactform', 
    'bareactgazette', 'bareactnotification', 'bareactschedule', 'bareactsection', 'bareactsectionindex', 
    'bareactsectionpara', 'bareactsectionref', 'bookreview', 'caseinfo', 'centralacts', 'ci', 'citation', 
    'citationserialno', 'court', 'courttype', 'equalcitation', 'journal', 'judge', 'judgementtext', 
    'judgementtextpara', 'judges', 'judgment', 'judgmentadvocates', 'judgmentcasenos', 'judgmentjudges', 
    'judgmentscited', 'judgmentstatus', 'judgmentstatustype', 'judgmenttopics', 'judonline', 'legislation', 
    'legislationsection', 'legislationsectionpara', 'legislationsectionref', 'legislationsubsection', 
    'legislationtype', 'longnote', 'longnotepara', 'newonline', 'notifications', 'online_citation', 
    'online_citations', 'onlinecitation', 'orders', 'publication', 'publicationyear', 'publisher', 
    'recycle_bin', 'rules', 'shortnote', 'shortnotedictionary', 'shortnoteleg', 'shortnotelegsec', 
    'shortnotelegsubsec', 'shortnotepara', 'statutes', 'sys_config', 'topic', 'users'
]

for table_name in table_order:
    try:
        # Get the primary key column for the current table
        slave_cursor.execute(f"SHOW KEYS FROM {table_name} WHERE Key_name = 'PRIMARY'")
        primary_key_info = slave_cursor.fetchone()

        if primary_key_info:
            primary_key_column = primary_key_info[4]

            # Fetch the highest primary key value for the current table
            slave_cursor.execute(f"SELECT MAX({primary_key_column}) FROM {table_name}")
            max_primary_key = slave_cursor.fetchone()[0] or 0

            # Check if the table already has an entry in the last_primary_keys table
            slave_cursor.execute("SELECT last_id FROM last_primary_keys WHERE table_name = %s", (table_name,))
            last_id_row = slave_cursor.fetchone()

            if last_id_row:
                # Update the last primary key value
                slave_cursor.execute("""
                    UPDATE last_primary_keys 
                    SET last_id = %s 
                    WHERE table_name = %s
                """, (max_primary_key, table_name))
                print(f"Updated last primary key for {table_name} to {max_primary_key}.")
            else:
                # Insert a new entry if no record exists
                slave_cursor.execute("""
                    INSERT INTO last_primary_keys (table_name, last_id)
                    VALUES (%s, %s)
                """, (table_name, max_primary_key))
                print(f"Inserted new entry for {table_name} with last primary key {max_primary_key}.")

            # Commit the changes
            slave_db.commit()

        else:
            print(f"No primary key found for table {table_name}. Skipping.")

    except Exception as e:
        print(f"Error processing table {table_name}: {e}")

# Close connections
slave_cursor.close()
slave_db.close()