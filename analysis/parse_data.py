import os
import json
import csv

from sqlalchemy import create_engine, MetaData, Table


PSITURK_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), "psiturk")
DATA_BASE_PATH = os.path.join(PSITURK_PATH, "participants.db")
CSV_OUTPUT_PATH = "/home/ar2625/dev/Online-Mousetracking/output.csv"


def parse_db():
    metadata = MetaData()
    metadata.bind = create_engine("sqlite:///" + DATA_BASE_PATH)

    table = Table("mouse_tracking_data", metadata, autoload=True)
    s = table.select()
    rows = s.execute()

    excluded_subjects = [] # can list any subject IDs to exclude from csv

    data = []
    psiturk_statuses = [2, 3, 4, 5, 7]  # status codes for successful completion etc.
    for row in rows:
        if row['status'] in psiturk_statuses and row['uniqueid'] not in excluded_subjects:
            data.append(row['datastring'])

    data = [json.loads(part)['data'] for part in data]

    return data

def create_dir(dir_path):
    if os.path.exists(dir_path):
        return
    if os.path.isdir(dir_path):
        return
    os.mkdir(dir_path)

def create_out_file(out_file_path):
    create_dir(os.path.dirname(out_file_path))
    file = open(out_file_path, 'wb')
    file.close()

def write_row_to_file(out_file_path, row_data):
    """
    Writes a new row into the given file
    :param out_file_path: name of the file that is to be written in
    :param row_data: the entire row entry that is to be written into the file
    :return: None
    """
    if not os.path.isfile(out_file_path):
        create_out_file(out_file_path)

    try:
        with open(out_file_path, 'a') as file:
            writer = csv.writer(file)
            writer.writerow(row_data)

    except Exception as e:
        print("ERROR [write_row_to_file]: could not write into " + out_file_path)
        print(str(e))
        assert False

def save_to_csv(db_data_as_list, out_csv_file_path):
    trial_rows = []
    column_titles = ['subject_id', 'first_time', 'trial_name', 'trial_num', 'counterbalance', 'trial_left_detail', 'trial_right_detail', 'trial_center_detail', 'trial_mouse_x', 'trial_mouse_y', 'timestamp', 'reaction_time', 'screen_resolution', 'browser_name', 'mouse_stopped_counter', 'mouse_outside_screen_counter']
    # column_titles = ['subject_id', 'trial_name', 'trial_num', 'trial_left_detail', 'trial_right_detail', 'trial_center_detail', 'trial_mouse_x', 'trial_mouse_y', 'reaction_time']

    # Write column titles as the first row
    write_row_to_file(out_csv_file_path, column_titles)

    for subject_data in db_data_as_list:
        if len(subject_data) == 0:
            continue

        subject_id = subject_data[0]["uniqueid"]

        for trial in subject_data:
            trial_data = trial["trialdata"]
            if trial_data["Phase"] == "trial":
               # idnum = trial_data['prolific_id']
                first_time = trial_data['FirstTime']
                trial_name = trial_data['TrialName'].split('_').pop();
                trial_num = trial_data['TrialNumber']
                counterbalance = trial_data['Counterbalance']
                trial_left_detail = trial_data['TrialLeftDetail']
                trial_right_detail = trial_data['TrialRightDetail']
                trial_center_detail = trial_data['TrialCenterDetail'].split('/').pop()
                trial_mouse_x = trial_data['MousePosXList']
                trial_mouse_y = trial_data['MousePosYList']
                timestamp = trial_data['Timestamp']
                reaction_time = trial_data['ReactionTime']
                screen_resolution = trial_data['ScreenResolution']
                browser_name = trial_data['BrowserName']
                mouse_stopped_counter = trial_data['MouseStoppedCounter']
                mouse_outside_screen_counter = trial_data['MouseOutsideScreenCounter']

                trial_rows = [subject_id, first_time, trial_name, trial_num, counterbalance, trial_left_detail, trial_right_detail, trial_center_detail, trial_mouse_x, trial_mouse_y, timestamp, reaction_time, screen_resolution, browser_name, mouse_stopped_counter, mouse_outside_screen_counter]
                #  trial_rows = [subject_id, trial_name, trial_num, trial_left_detail, trial_right_detail, trial_center_detail, trial_mouse_x, trial_mouse_y, reaction_time]

                # Write the row to the output CSV file
                write_row_to_file(out_csv_file_path, trial_rows)

if __name__ == '__main__':
    save_to_csv(parse_db(), CSV_OUTPUT_PATH)