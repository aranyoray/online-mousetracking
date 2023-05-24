let PROLIFIC_ID = "";

// let EXPERIMENT_PART = 0;
let START_INSTRUCTION = 0;

let TOTAL_MAIN_BLOCKS = 4; // non-practice blocks

let SKIP_PROLIFIC = true;
let SKIP_INSTRUCTIONS = false;

let psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

let pages = [
    "main.html"
];

psiTurk.preloadPages(pages);


/****************
 * Prolific ID  *
 ****************/

let ProlificID = function (condition_list) {
    psiTurk.showPage('main.html');

    if (SKIP_PROLIFIC) {
        InstructionRunner(condition_list);
        return;
    }

    while (true) {
        let searchParams = new URLSearchParams(window.location.search)

        let param = ""
        if (searchParams.has('PROLIFIC_PID')) {
            param = searchParams.get('PROLIFIC_PID')
        }

        PROLIFIC_ID = prompt("Please enter Prolific ID to proceed:", param);

        if (PROLIFIC_ID === null) {
            window.close();
            return;
        }
        
        if (PROLIFIC_ID.length === 24) {
            psiTurk.recordTrialData({
                'prolific_id': PROLIFIC_ID,
            });

            InstructionRunner(condition_list);
            return;
        }

        alert("Incorrect Prolific ID detected. Please try again.");
    }
}


/****************
 * Instructions  *
 ****************/
let InstructionRunner = function (condition_list) {

    let page = new InstructionPage();

    let total_instructions = page.get_total_instructions();

    let show_instruction_page = function (instruction_num) {
        if (SKIP_INSTRUCTIONS) {
            end_instructions();
        }

        if (instruction_num < total_instructions) {
            page.set_instruction_number(instruction_num);
            page.showNextInstruction(function () {
                show_instruction_page(instruction_num + 1);
            });
        } else {
            end_instructions();
        }
    };

    let end_instructions = function () {
        psiTurk.finishInstructions();
        Experiment(condition_list, 0, true);
    };

    // start the loop
    show_instruction_page(START_INSTRUCTION);
};


/***********************
 * Generic Page Runner *
 ***********************/
let GenericPageRunner = function (title, message, color_scheme,
                                  goToFunction) {

    let page = new GenericPage();
    page.setTitle(title);
    page.setMessage(message);
    page.setColorScheme(color_scheme);
    page.setCallback(function () {
        goToFunction();
    });
};


/**************
 * Experiment *
 **************/
function getBrowserName() {
    const userAgent = navigator.userAgent;
    const browsers = {
        Chrome: /chrome/i,
        Safari: /safari/i,
        Firefox: /firefox/i,
        IE: /internet explorer/i,
        Edge: /edg/i,
        Opera: /opera|OPR/i,
        Netscape: /netscape/i,
        Maxthon: /maxthon/i,
        SeaMonkey: /seamonkey/i,
    };
    for (const browser in browsers) {
        if (browsers[browser].test(userAgent)) {
            return browser;
        }
    }
    return "Unknown";
}

function getScreenResolution() {
    return `${window.screen.width}x${window.screen.height}`;
}


let Experiment = function (condition_list, block_num, is_practice) {
    let start_time = -1;

    let trial_data = new TrialData(condition_list, block_num, is_practice);

    let stimulus_data = condition_list["stimulus" + block_num];
    if (is_practice) {
        stimulus_data = condition_list["practice"];
    }

    let trial_page = new TrialPage(trial_data);

    let run_single_trial = function (curr_trial_page_index) {

        if (curr_trial_page_index >= stimulus_data.length) {
            end_experiment();
            return;
        }

        let callback = function() {
            console.log("Previous counters cleared.");
        };

        trial_page.setCurrentTrialNum(curr_trial_page_index);
        trial_page.clearResponse(callback);

        start_time = new Date().getTime();

        let update_trial_state = function () {
            if (!trial_page.getIsMouseRecording()) return;
            register_response(curr_trial_page_index);
            trial_page.clearResponse(update_trial_state);
            run_single_trial(curr_trial_page_index + 1);
        }

        trial_page.hideAllView();
        if (curr_trial_page_index == 0){
            trial_page.hideProgress();
        }
        setTimeout(function(){trial_page.showPage(update_trial_state);}, 1000);
    };
    let brows = getBrowserName();
    console.log(brows);

    let register_response = function () {
        let first_time = start_time;
        let trial_name = trial_page.getTrialName();
        let trial_number = trial_page.getTrialNumber();
        let counterbalance = trial_page.getCounterbalance();
        let trial_left_detail = trial_page.getTrialLeftDetail().getPartText();
        let trial_right_detail = trial_page.getTrialRightDetail().getPartText();
        let trial_center_detail = trial_page.getTrialCenterDetail().getPartImageSrc();
        let trial_mouse_pos_x = trial_page.getMouseXPosList();
        let trial_mouse_pos_y = trial_page.getMouseYPosList();
        let screen_resolution = getScreenResolution();
        let browser_name = getBrowserName();
        let timestamp = new Date().getTime();
        let reaction_time = new Date().getTime() - start_time;
        let mouse_stopped_counter = trial_page.getMouseStoppedCounter();
        let mouse_outside_screen_counter = trial_page.getMouseOutsideScreenCounter();

        psiTurk.recordTrialData({
            'Phase': "trial",
            'FirstTime': first_time,
            'TrialName': trial_name,
            'TrialNumber': trial_number + 1,
            'Counterbalance': counterbalance,
            'TrialLeftDetail': trial_left_detail, 
            'TrialRightDetail': trial_right_detail,
            'TrialCenterDetail': trial_center_detail,
            'MousePosXList': trial_mouse_pos_x,
            'MousePosYList': trial_mouse_pos_y,
            'ScreenResolution': screen_resolution,
            'BrowserName': browser_name,
            'Timestamp': timestamp,
            'ReactionTime': reaction_time,
            'MouseStoppedCounter': mouse_stopped_counter,
            'MouseOutsideScreenCounter': mouse_outside_screen_counter,
        });
    };

    let prompt_resubmit = function () {
        GenericPageRunner(
            "ERROR! Connection issue.",
            "Trying to resubmit...<br>" +
            "Press <b>continue</b> to resubmit and go back to Qualtrics.",
            Page.StatusError,
            function () {
                resubmit();
            }
        );
    };
    
    let resubmit = function () {
        let re_prompt = setTimeout(prompt_resubmit, 10000);
    
        psiTurk.saveData({
            success: function () {
                clearInterval(re_prompt);
                psiTurk.computeBonus('compute_bonus', function () {
                    window.open('', '_self', ''); window.close();
                });
            },
            error: prompt_resubmit
        });
    };

    let end_experiment = function () {
        psiTurk.saveData();

        if (block_num + 1 >= TOTAL_MAIN_BLOCKS) {
            GenericPageRunner(
                "<b>Excellent job!</b><br>",
                "That concludes this portion of the experiment. We have a few more quick questions and then you are all done!<br>",
                Page.StatusSuccess,
                function () {
                    Utils.leaveFullscreen();
                    psiTurk.saveData({
                        success: function() {
                            psiTurk.completeHIT();
                        },
                        error: prompt_resubmit
                    });
                }
            );
            return;
        }

        let next_trial_data = null;
        if (is_practice) {
            next_trial_data = new TrialData(condition_list, 0, false);
        } else {
            next_trial_data = new TrialData(condition_list, block_num + 1, false);
        }

        let left_detail = next_trial_data.get_trial_left_details().getPartText();
        let right_detail = next_trial_data.get_trial_right_details().getPartText();

        let body_string = "The next part of the study is very similar, except you will instead answer whether you think the character is <u>" + left_detail + "</u> or <u>" + right_detail + ".</u><br>" +
        "Press <b>CONTINUE</b> to begin!";
        if (is_practice) {
            body_string = "You did great!<br>" +
            "<b><i>Remember though, you want to respond as fast as possible!</b></i><br>" + 
            "Now we will begin the real trials. Your goal is to categorize these characters based on whether you believe the character is <u>Mostly Competent</u> or <u>Mostly Incompetent</u>. Recall that there are no wrong answers, and your goal is to answer as quickly as possible.<br>" + 
            "Press <b>CONTINUE</b> to start the experiment!";
        }

    let title_string = "<b><i>Great Work!</b></i>";

        GenericPageRunner(
            title_string,
            body_string,
            Page.StatusSuccess,
            function () {
                if (is_practice) {
                    Experiment(condition_list, 0, false);
                } else {
                    Experiment(condition_list, block_num + 1, false);
                }             
            }
        );
    };

    setTimeout(function(){
        trial_page.showTrials();
        run_single_trial(0);},200);
};


/*******************
 * Run Task
 ******************/
$(window).load(function () {

    function generateNewConditionList() {
        $.ajax({
            type: "POST",
            url: "stimulus",
            success: function () {
                console.log("Done creating new stimulus file!");
            },
            error: function () {
                console.log("ERROR[generateNewConditionList]: some error occurred.");
            },
        }).done(function(){
            loadConditionList();
        });
    }

    function loadConditionList() {
        $.ajax({
            dataType: 'json',
            url: "static/data/condition_list.json",
            async: false,
            success: function (condition_list) {
                console.log("condition", condition);
                ProlificID(condition_list);
            },
            error: function () {
                console.log("ERROR[load_condition_list]: some error occurred.");
            },
        });
    }

    if (Utils.isMobileTablet()) {
        console.log("mobile browser detected");
        alert(`Sorry, but mobile or tablet browsers are not supported. Please switch to a desktop browser.`);
        return;
    }

    generateNewConditionList();
    // loadConditionList();
});
