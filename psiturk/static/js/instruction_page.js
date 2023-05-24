let init_instructions = [
    [
        "This experiment requires you to be in <b>full screen</b> mode.<br><br>" +
        "We will switch you to full screen mode when you press <b>Next</b> below.<br><br>" +
        "Don't worry, we will return back to the normal size at the end of the experiment.<br><br>" + "" +
        "Please Note: If you do need to leave in the middle, you can press the ESC key -- but please avoid this. Your responses are only useful to us if you stay in this mode until the end of the experiment.<br><br>"+
        "Click <b>Next</b> to continue.",
        "center"
    ],
    [
        "In this part of the study, you will be asked to categorize a series of characters. Whether or not you recognize any or all of the characters does not matter, your goal is to categorize them as quickly as possible.<br><br>" + 
        "To begin a trial, you will click on the blue <b>START</b> button at the bottom of the screen. After you press the button, a character will appear in the center of your screen. As soon as you see the character, start moving your mouse to the top of the screen towards the button that you think best fits the character.<br><br>" +
        "<b>Please start moving your mouse as soon as the character appears, and keep your mouse on the screen throughout the entire trial</b> (you will receive a warning message if you take too long to start moving or if you leave the screen).<br><br>" +
        "There are no right or wrong answers -- use your \"gut instinct\" when making your judgments.<br><br>" + 
        "Please click the button below to begin!",
        "center"
    ],
    [
        "<br><br><br><br><br>We are about to start.<br>Are you ready?<br><br><br><br><br><br><br>",
        "center"
    ],
];

class InstructionPage extends Page {
    constructor() {
        super();
        this.showInstructions();

        this.full_screen_element = document.getElementById("full_screen_element");
        this.instructions = document.getElementById("instructions");
        this.next_button = document.getElementById("next_instruction");

        this.instructions_img_div = document.getElementById("instructions_img_div");
        this.instructions_img = document.getElementById("instructions_img");

        this.instructions_checkbox_div = document.getElementById("instructions_checkbox_div");
        this.instructions_checkbox = document.getElementById("checkbox_id");

        this.instruction_number = 0;

        this.is_checkbox_checked = true;
    }

    set_instruction_number(instruction_number) {
        this.instruction_number = instruction_number;
    }

    get_total_instructions() {
        return init_instructions.length;
    }

    showNextInstruction(callback) {
        this.next_button.onclick = function() {
            if (this.is_checkbox_checked) {
                console.log("INFO: next button clicked.");
                callback();
            }
            console.log(this.is_checkbox_checked);
        }.bind(this);
    
        if (this.instruction_number >= this.get_total_instructions()) {
            console.log("No more instructions to process.");
            return;
        }
    
        let instruction_array = init_instructions.slice();
    
        if (this.instruction_number > 1 && !Utils.isFullScreenCurrently()) {
            Utils.goFullscreen(this.full_screen_element);
        }
    
        if (this.instruction_number === 1) {
            this.is_checkbox_checked = false;
    
            this.next_button.style.display = "none";
            this.instructions_checkbox_div.style.display = "block";
    
            this.instructions_checkbox.addEventListener('change', (event) => {
                if (event.currentTarget.checked) {
                    this.is_checkbox_checked = true;
                    this.next_button.style.display = "block";
                } else {
                    this.is_checkbox_checked = false;
                    this.next_button.style.display = "none";
                }
            });
        } else {
            this.instructions_checkbox_div.style.display = "none";
        }
    
        if (this.instructions_img_div) {
            this.instructions_img_div.style.display = "none";
        }
    
        if (this.instructions) {
            this.instructions.innerHTML = instruction_array[this.instruction_number][0];
            this.instructions.style.textAlign = instruction_array[this.instruction_number][1];
        }
    }
    
}