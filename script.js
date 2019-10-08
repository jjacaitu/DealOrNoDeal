
    // Initiate the app Object
    const dealOrNoDealApp = {};

    // Setting the possible values inside an arrayso that they can be shuffled later.

    dealOrNoDealApp.casesValues = [1,10,20,50,100,200,400,800,1000,2000,10000,20000,50000,100000,200000,400000,800000,1000000,1500000,2000000];

    // create a property to store the player's name

    dealOrNoDealApp.playersName = "";

    // create a property where all the briefcases with the detail of the number and the value stored will be created

    dealOrNoDealApp.briefcases = [];

    // create a property to track in what turn the player is.
    dealOrNoDealApp.playersTurn = 1;

    // create a property to keep track of how many briefcases the player have to open.
    dealOrNoDealApp.briefcasesToOpen = 4;

    // create a property to store the deal the player takes in the case of this happening
    dealOrNoDealApp.dealTaken = 0;


    // Create a function inside the object (method) to pick a random number from the possible values: This will return one of the values from the array called casesValues and it will delete it from the array, doing this we make sure that the value is not repeated when creating the briefcases objects later.

    dealOrNoDealApp.pickRandomValue = function(){
        return dealOrNoDealApp.casesValues.splice(Math.floor(Math.random() * dealOrNoDealApp.casesValues.length),1)[0];
    }


    // Create de initialization function for the app. This will create each briefcase in the page by for looping the array with the possible values and creating bot the visual representation in the page and the briefcases objects in the app. It will also bind the event of the start button.

    dealOrNoDealApp.init = function(){

        dealOrNoDealApp.briefcaseClick;
        

        for(i=0;i<dealOrNoDealApp.casesValues.length;i++){
            // let valueType = ".lowValues";
            const value = dealOrNoDealApp.casesValues[i];
            // if(value > 2000){
            //     valueType = ".highValues"; 
            // }
            $(".values").append(
                `<p class='value value_${value}'>
                    $${value.toLocaleString()}</p>
                `);
    
        }

        // Set the number of briefcases in the game, future proofing in case the amount of possible values is changed.

        dealOrNoDealApp.numberOfBriefcases =  dealOrNoDealApp.casesValues.length;
    
        for(i=1;i<=dealOrNoDealApp.numberOfBriefcases;i++){
            dealOrNoDealApp.briefcases.push({
                number:i,
                value:dealOrNoDealApp.pickRandomValue()
            })
        }
    
        // The following for loop creates the html for every briefcase Object created.

        for(i=0;i<dealOrNoDealApp.briefcases.length;i++){
            $(".cases").append(
                `<div class="case case_${i}">
                    <div class="caseTop">
                        <div class="case_closed">
                            <p>${dealOrNoDealApp.briefcases[i].number}</p>
                        </div>
                        <div class="case_opened">
                        
                        </div>
                    </div>
                    <div class="caseBottom">
                    
                    </div>
                </div>`);
        }

        // click event when starting the event. Fading out the introduction to the game.

        $("form").on("submit",(e)=>{
            e.preventDefault();

            dealOrNoDealApp.playersName = $("#name").val();
            $(".header h2").text(`Welcome ${dealOrNoDealApp.playersName}! Please choose your briefcase`);

            $(".intro").fadeOut();
            
            $(".case").addClass("case_selectable");
            
        });
    }

    // Create a method inside the app to add the class to the briefcases in order to animate them when you open one and also appending the value related to that exact briefcase. This is done now in order to stop the player from trying to use the inspector to see whats inside each briefcase.

    dealOrNoDealApp.openBriefcase = function($briefcaseObject,value){
        const valueString = value.toLocaleString();
       $briefcaseObject.removeClass("case_selectable").off("click");
        $briefcaseObject.find(".case_closed").addClass("move_top_closed");
        $briefcaseObject.find(".case_opened").addClass("move_top_opened");
        $briefcaseObject.find(".caseBottom").append(`<p>$${valueString}</p>`)
        
    }


    // Handle the event of the user clicking each briefcase. This should:
        // *Select a briefcase the first time you click one of them.
        // *After you have selected a briefcase it should let you open the amount of briefcases specified in the property called briefcasesToOpen.
        // *If briefcasesToOpen is 0 it should let you click any briefcases anymore.
        // * On each click it should trigger the animation of opening briefcases
        // * After each click it should run a checking (method checkTurn) to see if there are more briefcases to open, if there aren't an offer from the banker should trigger


    dealOrNoDealApp.briefcaseClick = $(".cases").on("click",".case_selectable",function(){
        
        if(dealOrNoDealApp.selectedBriefcase != undefined && dealOrNoDealApp.briefcasesToOpen !== 0){
            
            
          
            

            const openedBriefcaseIndex = parseInt($(this).find("p").text()) - 1;
  
            const openedBriefcaseValue = dealOrNoDealApp.briefcases[openedBriefcaseIndex].value;

            dealOrNoDealApp.openBriefcase($(this),dealOrNoDealApp.briefcases[openedBriefcaseIndex].value);
            
            delete dealOrNoDealApp.briefcases[openedBriefcaseIndex];
            dealOrNoDealApp.briefcasesToOpen -= 1;
            dealOrNoDealApp.numberOfBriefcases -= 1;
            
            
            $(".info").text(`Please open a briefcase. Briefcases left to open: ${dealOrNoDealApp.briefcasesToOpen}`);
            
            if(dealOrNoDealApp.briefcasesToOpen === 0){
                $(".info").text(`The banker will make you an offer.`);
            }
            dealOrNoDealApp.checkTurn();
            setTimeout(()=>{
                $(this).find(".caseTop").addClass("desappear");
                $(`.value_${openedBriefcaseValue}`).addClass("off");
                setTimeout(() => {
                    $(this).find(".caseTop").remove(); 
                }, 500);
            },2500)
            
        }else if(dealOrNoDealApp.selectedBriefcase === undefined){
            dealOrNoDealApp.numberOfBriefcases -= 1;
            dealOrNoDealApp.selectedBriefcase = parseInt($(this).find("p").text());
            dealOrNoDealApp.selectedBriefcaseValue = dealOrNoDealApp.briefcases[dealOrNoDealApp.selectedBriefcase - 1].value;
            $(".info").text(`Please open a briefcase. Briefcases left to open: ${dealOrNoDealApp.briefcasesToOpen}`)
            
            $(this).removeClass("case_selectable").addClass("desappear").off("click");
            setTimeout(() => {
                $(".players_selection").append($(this).removeClass("desappear").addClass("appear"));
            }, 500);
        }   
    });

    // Create a method that will check if there are more briefcases to open after each click and check in what turn the user is. The reason we check the player's turn is to define if the banker should make an offer or if its time to offer a switch in the case of it being the last turn(just 1 more briefcase remaining)

    dealOrNoDealApp.checkTurn = function(){
        
        if(dealOrNoDealApp.briefcasesToOpen === 0){
            $(".cases .case").removeClass("case_selectable");
            if(dealOrNoDealApp.playersTurn === 6){
                setTimeout(()=>{
                    dealOrNoDealApp.switchCasesOptionAppear();
                },3100)
                
            }else{
                setTimeout(()=>{
                    dealOrNoDealApp.banksOfferAlertAppear();
                },3000)
            }

        }      

    }

    // Create a method that will trigger the openingBriefcase animation for all the remaining briefcases. This is only done when the player accepts an offer from the banker.

    dealOrNoDealApp.openRemainingBriefcases = function(){
        const remaining = dealOrNoDealApp.briefcases.filter((briefcase)=>{
            if(briefcase !== undefined){
                return true;
            }
        });

        $(".alert").removeClass("appear").addClass("desappear");
            setTimeout(() => {
                $(".alert").remove();
            }, 500);

        let timer = 0;
        remaining.forEach(function(briefcase){
            
            setTimeout(() => {
                const $remainingBriefcasesObject = $(".cases").find(`.case_${briefcase.number - 1}`);
                const openedBriefcaseValue = dealOrNoDealApp.briefcases[briefcase.number - 1].value;
                
                dealOrNoDealApp.openBriefcase($remainingBriefcasesObject,openedBriefcaseValue);
                setTimeout(() => {
                    $remainingBriefcasesObject.find(".caseTop").addClass("desappear");
                    if(openedBriefcaseValue !== dealOrNoDealApp.selectedBriefcaseValue){
                        $(`.value_${openedBriefcaseValue}`).addClass("off");
                    }
                }, 2000);
                
                

               }, timer);

               if(briefcase.number !== dealOrNoDealApp.selectedBriefcase){
                    timer += 2000;
               }   
        });

        setTimeout(() => {
            dealOrNoDealApp.openBriefcase($(`.case_${dealOrNoDealApp.selectedBriefcase - 1}`),dealOrNoDealApp.selectedBriefcaseValue);
           }, 2000 * (remaining.length - 1));
        
    }


    // Create a method to make an alert appear giving you the option to switch your briefcase on the final turn.

    dealOrNoDealApp.switchCasesOptionAppear = function(){
                
        const remainingBriefcase = $(".cases .caseTop").find("p").text();
        let time = 15;
        $(".gameBoard").append(`
        <div class="alert appear">
            <div>
                <i class="fas fa-phone-volume"></i>
                <h2>Bank's offer:</h2>
            </div>
            <p>${dealOrNoDealApp.playersName}! The bank would like to offer you the option to change your selected briefcase for briefcase <span>#${remainingBriefcase}<span></p>
            <div>
                <button class="deal"><i class="fas fa-check"></i>DEAL</button>
                <button class="no_deal"><i class="fas fa-times"></i>NO DEAL</button>
            </div>
        </div>

        `);

        $(".alert").append(`<p class="time">Time remaining: ${time}</p>`)
        const timeInterval = setInterval(() => {
            time -=1;
            $(".time").text(`Time remaining: ${time}`);
            if(time === 0){
                
                $(".no_deal").trigger("click");
            }
        }, 1000);

        $(".deal").on("click",()=>{
            clearInterval(timeInterval);
            $(".info").text(`${dealOrNoDealApp.playersName}! Let's see what you've got in your briefcase.`);
            $(".alert").remove();
            const $selectedBriefcase = $(".players_selection").find(".case");

            const $casesInGameBoard = $(".cases").find(".case");
            let $remainingBriefcase;

            for(i=0;i<=$casesInGameBoard.length;i++){
                const $caseFound = $(`.case_${i}`).find(".caseTop");
                if($caseFound.length > 0 && i != (dealOrNoDealApp.selectedBriefcase - 1)){
                     $remainingBriefcase = $(`.case_${i}`);
                }
            }

            console.log($remainingBriefcase);
            $selectedBriefcase.removeClass("appear").addClass("desappear");
            $remainingBriefcase.addClass("desappear");
            dealOrNoDealApp.selectedBriefcase = parseInt($remainingBriefcase.find("p").text());
            dealOrNoDealApp.selectedBriefcaseValue = dealOrNoDealApp.briefcases[dealOrNoDealApp.selectedBriefcase - 1].value;
            setTimeout(() => {
                $selectedBriefcase.remove();
                $remainingBriefcase.remove();
                $(".cases").append($selectedBriefcase.removeClass("desappear").addClass("appear"));
                $(".players_selection").append($remainingBriefcase.removeClass("desappear").addClass("appear"));

                setTimeout(() => {
                    dealOrNoDealApp.openRemainingBriefcases();
                    setTimeout(() => {
                        const message = dealOrNoDealApp.getFinalMessage(true);
                        $(".gameBoard").append(`
                        <div class='alert appear'>
                            <h2>Result</h2>
                            <p>${message}</p>
                        </div>`);
                    }, 2000 * dealOrNoDealApp.numberOfBriefcases + 1);
                }, 500);
            }, 500);
            


        });
        $(".no_deal").on("click",()=>{
            clearInterval(timeInterval);
            $(".info").text(`${dealOrNoDealApp.playersName}! Let's see what you've got in your briefcase.`);
            $(".alert").remove();
            const selectedBriefcaseValue = dealOrNoDealApp.selectedBriefcaseValue;
 
            dealOrNoDealApp.openRemainingBriefcases();
            
            setTimeout(()=>{
                dealOrNoDealApp.openBriefcase($("players_selection"),selectedBriefcaseValue);
                setTimeout(() => {
                    const message = dealOrNoDealApp.getFinalMessage(false);
                    $(".gameBoard").append(`
                    <div class='alert appear'>
                        <h2>Result</h2>
                        <p>${message}</p>
                    </div>`);
                }, 2000);
            },1000);
            
            
        })


    }

    // Create a method that makes an alert appear each time the banker makes an offer. This will trigger when the player finishes each turn which whill be determined by the number of briefcases left to open 

    dealOrNoDealApp.banksOfferAlertAppear = function(){
        const banksOffer = dealOrNoDealApp.calculateBanksOffer();
        let time = 15;
        
        $(".gameBoard").append(`
        <div class="alert appear">
            <div>
                <i class="fas fa-phone-volume"></i>
                <h2>Bank's offer:</h2>
            </div>
            <p>${dealOrNoDealApp.playersName}! The bank offers to buy your briefcase for: <span>$${banksOffer.toLocaleString()}<span></p>
            <div>
                <button class="deal"><i class="fas fa-check"></i>DEAL</button>
                <button class="no_deal"><i class="fas fa-times"></i>NO DEAL</button>
            </div>
        </div>

        `);

        $(".alert").append(`<p class="time">Time remaining: ${time}</p>`)
        const timeInterval = setInterval(() => {
            time -=1;
            $(".time").text(`Time remaining: ${time}`);
            if(time === 0){
                
                $(".no_deal").trigger("click");
            }
        }, 1000);

        $(".deal").on("click",()=>{
            clearInterval(timeInterval);
            dealOrNoDealApp.dealTaken = banksOffer;
            $(".info").text(`${dealOrNoDealApp.playersName}! You accepted a deal for $${dealOrNoDealApp.dealTaken.toLocaleString()}. Let's see if you made a good deal or not.`);
            dealOrNoDealApp.openRemainingBriefcases();
            setTimeout(() => {
                const message = dealOrNoDealApp.getFinalMessage(false);
                    $(".gameBoard").append(`
                    <div class='alert appear'>
                        <h2>Result</h2>
                        <p>${message}</p>
                    </div>`);
            }, 2000 * (dealOrNoDealApp.numberOfBriefcases));
        });


        $(".no_deal").on("click",()=>{
            clearInterval(timeInterval);
            $(".alert").removeClass("appear").addClass("desappear");
            setTimeout(() => {
                $(".alert").remove();
            }, 500);
            dealOrNoDealApp.playersTurn +=1;
            const turn = dealOrNoDealApp.playersTurn;
            switch(turn){
                case 2:
                    dealOrNoDealApp.briefcasesToOpen = 4;
                    break;
                case 3:
                case 4:
                    dealOrNoDealApp.briefcasesToOpen = 3;
                    break;
                case 5:
                case 6:
                    dealOrNoDealApp.briefcasesToOpen = 2;
                    break;
                
            }
            const $casesInGameBoard = $(".cases").find(".case");
            
            for(i=0;i<=$casesInGameBoard.length;i++){
                const $caseFound = $(`.case_${i}`).find(".caseTop");
                if($caseFound.length > 0 ){
                    $(`.case_${i}`).addClass("case_selectable")
                }
            }

            $(".info").text(`${dealOrNoDealApp.playersName}! Please open a briefcase. Briefcases left to open: ${dealOrNoDealApp.briefcasesToOpen}`);
            
            
        })


    }

    // Create a method to generate the final message in the case of the player making a deal.

    dealOrNoDealApp.generateFinalMessageDeal = function(goodOrBad = "good", lessOrMore = "more"){
        return `You made a <span>${goodOrBad} deal! </span>You just sold your briefcase which had <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span> inside for <span>$${dealOrNoDealApp.dealTaken.toLocaleString()}</span>. You just won <span>$${ Math.abs( dealOrNoDealApp.dealTaken - dealOrNoDealApp.selectedBriefcaseValue).toLocaleString()} ${lessOrMore}</span> than what you would have if you had stayed with your briefcase!`;
    } 

    // Create a method to generate a message in the case of the player not making a deal, but deciding to stay with the original briefcase or switching it for the only remaining one.

    dealOrNoDealApp.getFinalMessage = function(switchBoolean){
        let switchStatus = "";
        let message = "";
        

        if(switchBoolean){
            switchStatus = "switch";
           
        }else{
            switchStatus = "stay";
            
        }
        
       
        
        

        // console.log("remaining")
        // console.log(remainingBriefcaseValue);
        // console.log("selected");
        // console.log(dealOrNoDealApp.selectedBriefcaseValue);

        
        if(dealOrNoDealApp.dealTaken !== 0){
            if(dealOrNoDealApp.dealTaken > dealOrNoDealApp.selectedBriefcaseValue){
                message = dealOrNoDealApp.generateFinalMessageDeal();
            }else{
                message = dealOrNoDealApp.generateFinalMessageDeal("bad","less");
            }
        }else{
            const remainingBriefcaseValue = dealOrNoDealApp.briefcases[parseInt($(".cases .caseTop").find("p").text()) - 1].value;
            if(dealOrNoDealApp.selectedBriefcaseValue > remainingBriefcaseValue){
                
                if(dealOrNoDealApp.selectedBriefcaseValue < 400000){
                    message = `${dealOrNoDealApp.playersName}! You made a <span>good decision</span> to ${switchStatus} your briefcase, you won <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span>. It's not bad but maybe you could have got a better deal!`
                }else if(dealOrNoDealApp.selectedBriefcaseValue === 2000000){
                    message = `${dealOrNoDealApp.playersName}! You made an <span>excellent decision</span> to ${switchStatus} your briefcase, you won <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span> which is the highest value possible! CONGRATULATIONS!`
                }else{
                    message = `${dealOrNoDealApp.playersName}! You made a <span>very good decision</span> to ${switchStatus} your briefcase, you won <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span> which is one of the <span>highest values!</span>`
                }
                
            }else{
                if(dealOrNoDealApp.selectedBriefcaseValue < 400000){
                    if(dealOrNoDealApp.selectedBriefcaseValue < 2000){
                        message = `${dealOrNoDealApp.playersName}! You made a <span>bad decision</span> when you decided to ${switchStatus} your briefcase. You won <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span>, which is a really low amount.`
                    }else{
                        message = `${dealOrNoDealApp.playersName}! You made a <span>bad decision</span> when you decided to ${switchStatus} your briefcase. You won <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span>. You could have made a better deal!`;
                    }
                }else if(remainingBriefcaseValue === 2000000){
                    message = `${dealOrNoDealApp.playersName}! You made an <span>awful decision</span> when you decided to ${switchStatus} your briefcase, you won <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span>, but you had $2000000 in your previous briefcase which is the highest value of the game!`
                }else{
                    message = `${dealOrNoDealApp.playersName}! You made a <span>bad decision</span> when you decided to ${switchStatus} your briefcase, you won <span>$${dealOrNoDealApp.selectedBriefcaseValue.toLocaleString()}</span>, eventhough you could have won more money, you got which is a really high value!`
                }
            }
        }

        return message;
    } 

    // Create a method to calculate the banks offer in each turn.

    dealOrNoDealApp.calculateBanksOffer = function(){
        
        function findExpectedValue(array){
            let initialValue = 0;
            const sumOfAllValues = array.reduce((accumulator,currentValue)=>{
                
                return currentValue.value + accumulator;
            },initialValue);

            if(array.length === 0){
                return 0;
            }else{
                return sumOfAllValues/array.length;
            }

           
        }
   

        let banksOffer = 0;
        let lowValues = dealOrNoDealApp.briefcases.filter((briefcase)=>{
            if(briefcase.value <= 2000 && briefcase.value !== dealOrNoDealApp.selectedBriefcaseValue){
                return true;
            }
        });

        let highValues = dealOrNoDealApp.briefcases.filter((briefcase)=>{
            if(briefcase.value > 2000 && briefcase.value !== dealOrNoDealApp.selectedBriefcaseValue){
                return true;
            }
        });

        



        

        const amountOfRemainingBriefcases = dealOrNoDealApp.numberOfBriefcases;
        
        switch(amountOfRemainingBriefcases){
            case 15:
                banksOffer = (0.02 * findExpectedValue(highValues)) + (0.5 * findExpectedValue(lowValues));
                
                break;
            case 11:
                banksOffer = (0.05 * findExpectedValue(highValues)) + (1 * findExpectedValue(lowValues));
                
                break;
            case 8:
                banksOffer = (0.1 * findExpectedValue(highValues)) + (1.5 * findExpectedValue(lowValues));
                
                break;
            case 5:
                banksOffer = (0.30 * findExpectedValue(highValues)) + (2 * findExpectedValue(lowValues));
                
                break;
            case 3:
                banksOffer = (0.40 * findExpectedValue(highValues)) + (2.5 * findExpectedValue(lowValues));
                
                break;

        }

        return Math.floor(banksOffer);
    }


    // document ready function

    $(function(){   
        
        dealOrNoDealApp.init();
        console.log(dealOrNoDealApp.briefcases)
        
        
});