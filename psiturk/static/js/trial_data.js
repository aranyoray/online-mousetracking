class PartType {
    static TEXT = "text"
    static IMAGE = "image"
}


class PartLocation {
    static LEFT = "LEFT";
    static CENTER = "CENTER";
    static RIGHT = "RIGHT";
    static BOTTOM = "BOTTOM";
}


class PartDetails {
    constructor(location, part_type, part_text, part_img_src) {
        this.part_location = location;
        this.part_type = part_type;
        this.part_text = part_text;
        this.part_image_src = part_img_src;
    }

    getPartLocation() {
        return this.part_location;
    }

    getPartType() {
        return this.part_type;
    }

    getPartText() {
        return this.part_text;
    }

    getPartImageSrc() {
        return this.part_image_src;
    }
}


class MousePosition {
    constructor(x_pos, y_pos) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
    }

    getXPos() {
        console.log(this.x_pos);
        return this.x_pos;
    }

    getYPos() {
        console.log(this.y_pos);
        return this.y_pos;
    }
}


class StimulusData {
    constructor(trial_id,
                trial_num,
                trial_type,
                counterbalance,
                trial_left, trial_display_left, trial_img_left_src,
                trial_center, trial_display_center, trial_img_center_src,
                trial_right, trial_display_right, trial_img_right_src,
                trial_bottom, trial_display_bottom, trial_img_bottom_src) {

        this.trial_id = trial_id;
        this.trial_num = trial_num;
        this.trial_type = trial_type;
        this.counterbalance = counterbalance;
        this.trial_left_part = new PartDetails(PartLocation.LEFT,
                                               trial_left, trial_display_left, trial_img_left_src);
        this.trial_center_part = new PartDetails(PartLocation.CENTER,
                                                 trial_center, trial_display_center, trial_img_center_src);
        this.trial_right_part = new PartDetails(PartLocation.RIGHT,
                                                trial_right, trial_display_right, trial_img_right_src);
        this.trial_bottom_part = new PartDetails(PartLocation.BOTTOM,
                                                 trial_bottom, trial_display_bottom, trial_img_bottom_src);
    }

    get_trial_id(){
        return this.trial_id;
    }

    get_trial_number(){
        return this.trial_num;
    }

    get_trial_type(){
        return this.trial_type;
    }

    get_trial_name() {
        return this.get_trial_type() + "_" + this.get_trial_id();
    }

    get_counterbalance(){
        return this.counterbalance;
    }

    get_trial_left_part_details() {
        return this.trial_left_part;
    }

    get_trial_center_part_details() {
        return this.trial_center_part;
    }

    get_trial_right_part_details() {
        return this.trial_right_part;
    }

    get_trial_bottom_part_details() {
        return this.trial_bottom_part;
    }
}


class TrialData {

    constructor(trial_data, block_num, is_practice) {
        this.block_num = block_num;
        this.is_practice = is_practice;

        this.stimulus_list = [];
        this.image_list = [];

        this.#parse_trial_data(trial_data);

        this.current_trial_num = 0;
    }

    #get_preloaded_image(url) {
        if(url != null) {
            let img = new Image();
            img.src = url;
            this.image_list.push(img);
            return this.image_list.at(-1).src;
        }
        return null;
    }

    #parse_trial_data(trial_data) {

        let base_path = "../static/images/";

        let stimuli_data = trial_data["stimulus" + this.block_num];
        if (this.is_practice) {
            stimuli_data = trial_data["practice"];
        }

        for (let trial_num = 0; trial_num < stimuli_data.length; trial_num++) {
            let stimulus_data = stimuli_data[trial_num];

            let trial_id = null;
            let trial_part_string = null;
            let trial_counterbalance = 0;

            let trial_display_left = null;
            let trial_display_center = null;
            let trial_display_right = null;
            let trial_display_bottom = null;

            let trial_img_left = null;
            let trial_img_center = null;
            let trial_img_right = null;
            let trial_img_bottom = null;

            trial_id = stimulus_data["trial_id"];
            trial_part_string = stimulus_data["trial_type"];
            trial_counterbalance = stimulus_data["counterbalance"];

            if (trial_part_string.split("_").length !== 4) {
                console.log("ERROR[parse_trial_data]: incorrect trial type in condition file");
                throw message || "ERROR[parse_trial_data]: incorrect trial type in condition file";
            }

            let trial_left_part_type = trial_part_string.split("_")[0];
            if (trial_left_part_type === PartType.IMAGE) {
                trial_display_left = base_path + stimulus_data["trial_display_left"];
                trial_img_left = this.#get_preloaded_image(trial_display_left);
            } else {
                trial_display_left = stimulus_data["trial_display_left"];
            }

            let trial_center_part_type = trial_part_string.split("_")[1];
            if (trial_center_part_type === PartType.IMAGE) {
                trial_display_center = base_path + stimulus_data["trial_display_center"];
                trial_img_center = this.#get_preloaded_image(trial_display_center);
            } else {
                trial_display_center = stimulus_data["trial_display_center"];
            }

            let trial_right_part_type = trial_part_string.split("_")[2];
            if (trial_right_part_type === PartType.IMAGE) {
                trial_display_right = base_path + stimulus_data["trial_display_right"];
                trial_img_right = this.#get_preloaded_image(trial_display_right);
            } else {
                trial_display_right = stimulus_data["trial_display_right"];
            }

            let trial_bottom_part_type = trial_part_string.split("_")[3];
            if (trial_bottom_part_type === PartType.IMAGE) {
                trial_display_bottom = base_path + stimulus_data["trial_display_bottom"];
                trial_img_bottom = this.#get_preloaded_image(trial_display_bottom);
            } else {
                trial_display_bottom = stimulus_data["trial_display_bottom"];
            }

            this.stimulus_list.push(new StimulusData(trial_id,
                                                     trial_num,
                                                     trial_part_string,
                                                     counterbalance,
                                                     trial_left_part_type, trial_display_left, trial_img_left,
                                                     trial_center_part_type, trial_display_center, trial_img_center,
                                                     trial_right_part_type, trial_display_right, trial_img_right,
                                                     trial_bottom_part_type, trial_display_bottom, trial_img_bottom));
        }
    }

    #get_current_stimulus_data() {
        return this.stimulus_list[this.current_trial_num];
    }

    update_current_trial_num(current_trial_num) {
        this.current_trial_num = current_trial_num;
    }

    get_trial_number() {
        return this.#get_current_stimulus_data().get_trial_number();
    }

    get_trial_name() {
        return this.#get_current_stimulus_data().get_trial_name();
    }

    get_counterbalance() {
        return this.#get_current_stimulus_data().get_counterbalance();
    }

    get_total_trials() {
        return this.stimulus_list.length;
    }

    get_trial_left_details() {
        return this.#get_current_stimulus_data().get_trial_left_part_details();
    }

    get_trial_center_details() {
        return this.#get_current_stimulus_data().get_trial_center_part_details();
    }

    get_trial_right_details() {
        return this.#get_current_stimulus_data().get_trial_right_part_details();
    }

    get_trial_bottom_details() {
        return this.#get_current_stimulus_data().get_trial_bottom_part_details();
    }
}