import mysql.connector

# Connect to main database (source)
main_db = mysql.connector.connect(
    host="192.168.0.6",
    user="alduser",
    password="ald123",
    database="ald_db",
    charset="utf8"  # Specify charset here
)

# Connect to slave database (destination)
slave_db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Areesha1$",
    database="ald",
    charset="utf8"  # Specify charset here
)
main_cursor = main_db.cursor()
slave_cursor = slave_db.cursor()

table_order = [
    'BareAct', 'CourtType', 'Advocate', 'Judge', 'JudgmentStatusType', 'Topic', 
    'LegislationType', 'Publisher', 'BareActChapterIndex', 'BareActForm', 
    'BareActGazette', 'BareActNotification', 'BareActSchedule', 'BareActSection', 
    'Court', 'Legislation', 'Publication', 'BareActSectionIndex', 'BareActAmmendment', 
    'BareActSectionPara', 'BareActSectionRef', 'Judgment', 'LegislationSection', 
    'PublicationYear', 'EqualCitation', 'JudgementText', 'JudgmentAdvocates', 
    'JudgmentCaseNos', 'JudgmentJudges', 'JudgmentStatus', 'JudgmentTopics', 
    'ShortNote', 'LegislationSectionPara', 'LegislationSectionRef', 'LegislationSubSection', 
    'Citation', 'JudgementTextPara', 'JudgmentsCited', 'LongNote', 'ShortNoteLeg', 
    'ShortNoteLegSec', 'ShortNotePara', 'ShortNoteLegSubSec', 'LongNotePara'
]


for table_name in table_order:
    # Verify main_cursor fetches only primary key info
    main_cursor.execute(f"SHOW KEYS FROM {table_name} WHERE Key_name = 'PRIMARY'")
    primary_key_info = main_cursor.fetchone()

    if primary_key_info:
        primary_key_column = primary_key_info[4]

        # Get last known primary key from last_primary_keys table in slave database
        slave_cursor.execute("SELECT last_id FROM last_primary_keys WHERE table_name = %s", (table_name,))
        last_id_row = slave_cursor.fetchone()
        last_id = last_id_row[0] if last_id_row else 0

        print(f"Table: {table_name}, Last Primary Key: {last_id}")

        # Select rows from main database that aren't yet in the slave database
        main_cursor.execute(
            f"SELECT * FROM {table_name} WHERE {primary_key_column} > %s", (last_id,)
        )
        rows = main_cursor.fetchall()

        if rows:
            # Prepare and insert rows into slave database only
            placeholders = ", ".join(["%s"] * len(rows[0]))
            insert_query = f"INSERT INTO {table_name} VALUES ({placeholders})"

            for row in rows:
                try:
                    slave_cursor.execute(insert_query, row)
                except mysql.connector.errors.IntegrityError:
                    # Skip row if it causes a duplicate error
                    print(f"Duplicate found for {table_name}, skipping row with {primary_key_column} = {row[0]}.")

            # Commit the rows inserted to the slave database
            slave_db.commit()
            print(f"Copied {len(rows)} rows to {table_name} in slave database.")

            # Verification query on slave database to confirm insertions
            slave_cursor.execute(f"SELECT COUNT(*) FROM {table_name} WHERE {primary_key_column} > %s", (last_id,))
            count_in_slave = slave_cursor.fetchone()[0]
            print(f"Verified: {count_in_slave} rows exist in {table_name} in the slave database.")

            # Update last known primary key in slave database after successful insertion
            slave_cursor.execute(f"""
                UPDATE last_primary_keys 
                SET last_id = (SELECT MAX({primary_key_column}) FROM {table_name}) 
                WHERE table_name = %s
            """, (table_name,))
            slave_db.commit()
        else:
            print(f"No new rows found for {table_name} where {primary_key_column} > {last_id}.")

# Close connections
main_cursor.close()
slave_cursor.close()
main_db.close()
slave_db.close()