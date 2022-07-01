/* This file, as oppposed to puz-led_main, handles
the creation of new puzzles. The file does so by simulating 
solving a given puzzle backwards, starting with a solved puzzle
and making random moves backwards to scramble it. */

//select a seed based on the day and generate random numbers stemming from that seed
let day_seed = Math.floor(Date.now()/86400000)
//day_seed = Math.random()*10000;

let word;
let box_list;
const positions = [[1,1],[1,2],[1,3],[2,3],[3,3],[3,2],[3,1],[2,1]];
const generate_puzzle = (seed) => {
    //generate random numbers stemming from the seed
    const random_seeded = (length) => {
        let day = new Date(Date().slice(4,24)).getDay();
        let num = Math.sin(seed*day)**2 * 10000;
        let seed_draft = num - Math.floor(num);
        seed = seed_draft*10000;
        return Math.floor(seed_draft*length);
    };

    //select the day's word
    const words = ['Ability', 'Absence', 'Academy', 'Account', 'Accused', 'Achieve', 'Acquire', 'Address', 'Advance', 'Adverse', 'Advised', 'Adviser', 'Against', 'Airline', 'Airport', 'Alcohol', 'Alleged', 'Already', 'Analyst', 'Ancient', 'Another', 'Anxiety', 'Anxious', 'Anybody', 'Applied', 'Arrange', 'Arrival', 'Article', 'Assault', 'Assumed', 'Assured', 'Attempt', 'Attract', 'Auction', 'Average', 'Backing', 'Balance', 'Banking', 'Barrier', 'Battery', 'Bearing', 'Beating', 'Because', 'Bedroom', 'Believe', 'Beneath', 'Benefit', 'Besides', 'Between', 'Billion', 'Binding', 'Brother', 'Brought', 'Burning', 'Cabinet', 'Caliber', 'Calling', 'Capable', 'Capital', 'Captain', 'Caption', 'Capture', 'Careful', 'Carrier', 'Caution', 'Ceiling', 'Central', 'Centric', 'Century', 'Certain', 'Chamber', 'Channel', 'Chapter', 'Charity', 'Charlie', 'Charter', 'Checked', 'Chicken', 'Chronic', 'Circuit', 'Classes', 'Classic', 'Climate', 'Closing', 'Closure', 'Clothes', 'Collect', 'College', 'Combine', 'Comfort', 'Command', 'Comment', 'Compact', 'Company', 'Compare', 'Compete', 'Complex', 'Concept', 'Concern', 'Concert', 'Conduct', 'Confirm', 'Connect', 'Consent', 'Consist', 'Contact', 'Contain', 'Content', 'Contest', 'Context', 'Control', 'Convert', 'Correct', 'Council', 'Counsel', 'Counter', 'Country', 'Crucial', 'Crystal', 'Culture', 'Current', 'Cutting', 'Dealing', 'Decided', 'Decline', 'Default', 'Defence', 'Deficit', 'Deliver', 'Density', 'Deposit', 'Desktop', 'Despite', 'Destroy', 'Develop', 'Devoted', 'Diamond', 'Digital', 'Discuss', 'Disease', 'Display', 'Dispute', 'Distant', 'Diverse', 'Divided', 'Drawing', 'Driving', 'Dynamic', 'Eastern', 'Economy', 'Edition', 'Elderly', 'Element', 'Engaged', 'Enhance', 'Essence', 'Evening', 'Evident', 'Exactly', 'Examine', 'Example', 'Excited', 'Exclude', 'Exhibit', 'Expense', 'Explain', 'Explore', 'Express', 'Extreme', 'Factory', 'Faculty', 'Failing', 'Failure', 'Fashion', 'Feature', 'Federal', 'Feeling', 'Fiction', 'Fifteen', 'Filling', 'Finance', 'Finding', 'Fishing', 'Fitness', 'Foreign', 'Forever', 'Formula', 'Fortune', 'Forward', 'Founder', 'Freedom', 'Further', 'Gallery', 'Gateway', 'General', 'Genetic', 'Genuine', 'Gigabit', 'Greater', 'Hanging', 'Heading', 'Healthy', 'Hearing', 'Heavily', 'Helpful', 'Helping', 'Herself', 'Highway', 'Himself', 'History', 'Holding', 'Holiday', 'Housing', 'However', 'Hundred', 'Husband', 'Illegal', 'Illness', 'Imagine', 'Imaging', 'Improve', 'Include', 'Initial', 'Inquiry', 'Insight', 'Install', 'Instant', 'Instead', 'Intense', 'Interim', 'Involve', 'Jointly', 'Journal', 'Journey', 'Justice', 'Justify', 'Keeping', 'Killing', 'Kingdom', 'Kitchen', 'Knowing', 'Landing', 'Largely', 'Lasting', 'Leading', 'Learned', 'Leisure', 'Liberal', 'Liberty', 'Library', 'License', 'Limited', 'Listing', 'Logical', 'Loyalty', 'Machine', 'Manager', 'Married', 'Massive', 'Maximum', 'Meaning', 'Measure', 'Medical', 'Meeting', 'Mention', 'Message', 'Million', 'Mineral', 'Minimal', 'Minimum', 'Missing', 'Mission', 'Mistake', 'Mixture', 'Monitor', 'Monthly', 'Morning', 'Musical', 'Mystery', 'Natural', 'Neither', 'Nervous', 'Network', 'Neutral', 'Notable', 'Nothing', 'Nowhere', 'Nuclear', 'Nursing', 'Obvious', 'Offense', 'Officer', 'Ongoing', 'Opening', 'Operate', 'Opinion', 'Optical', 'Organic', 'Outcome', 'Outdoor', 'Outlook', 'Outside', 'Overall', 'Pacific', 'Package', 'Painted', 'Parking', 'Partial', 'Partner', 'Passage', 'Passing', 'Passion', 'Passive', 'Patient', 'Pattern', 'Payable', 'Payment', 'Penalty', 'Pending', 'Pension', 'Percent', 'Perfect', 'Perform', 'Perhaps', 'Phoenix', 'Picking', 'Picture', 'Pioneer', 'Plastic', 'Pointed', 'Popular', 'Portion', 'Poverty', 'Precise', 'Predict', 'Premier', 'Premium', 'Prepare', 'Present', 'Prevent', 'Primary', 'Printer', 'Privacy', 'Private', 'Problem', 'Proceed', 'Process', 'Produce', 'Product', 'Profile', 'Program', 'Project', 'Promise', 'Promote', 'Protect', 'Protein', 'Protest', 'Provide', 'Publish', 'Purpose', 'Pushing', 'Qualify', 'Quality', 'Quarter', 'Radical', 'Railway', 'Readily', 'Reading', 'Reality', 'Realize', 'Receipt', 'Receive', 'Recover', 'Reflect', 'Regular', 'Related', 'Release', 'Remains', 'Removal', 'Removed', 'Replace', 'Request', 'Require', 'Reserve', 'Resolve', 'Respect', 'Respond', 'Restore', 'Retired', 'Revenue', 'Reverse', 'Rollout', 'Routine', 'Running', 'Satisfy', 'Science', 'Section', 'Segment', 'Serious', 'Service', 'Serving', 'Session', 'Setting', 'Seventh', 'Several', 'Shortly', 'Showing', 'Silence', 'Silicon', 'Similar', 'Sitting', 'Sixteen', 'Skilled', 'Smoking', 'Society', 'Somehow', 'Someone', 'Speaker', 'Special', 'Species', 'Sponsor', 'Station', 'Storage', 'Strange', 'Stretch', 'Student', 'Studied', 'Subject', 'Succeed', 'Success', 'Suggest', 'Summary', 'Support', 'Suppose', 'Supreme', 'Surface', 'Surgery', 'Surplus', 'Survive', 'Suspect', 'Sustain', 'Teacher', 'Telecom', 'Telling', 'Tension', 'Theatre', 'Therapy', 'Thereby', 'Thought', 'Through', 'Tonight', 'Totally', 'Touched', 'Towards', 'Traffic', 'Trouble', 'Turning', 'Typical', 'Uniform', 'Unknown', 'Unusual', 'Upgrade', 'Upscale', 'Utility', 'Variety', 'Various', 'Vehicle', 'Venture', 'Version', 'Veteran', 'Victory', 'Viewing', 'Village', 'Violent', 'Virtual', 'Visible', 'Waiting', 'Walking', 'Wanting', 'Warning', 'Warrant', 'Wearing', 'Weather', 'Webcast', 'Website', 'Wedding', 'Weekend', 'Welcome', 'Welfare', 'Western', 'Whereas', 'Whereby', 'Whether', 'Willing', 'Winning', 'Without', 'Witness', 'Working', 'Writing', 'Written'];
    word = words[random_seeded(words.length)].toLowerCase();

    //create a virtual solved puzzle in the form of a list
    let game = [];
    let start_point = random_seeded(8);
    for (let i=0; i<8; i++) {
        let new_box = []
        if (i >= start_point && i-7 < start_point) {
            new_box.push({
                letter: word[i-start_point],
                number: i-start_point+1,
            });
        };
        game.push(new_box);
    };
    for (let i=0; i<=start_point-2; i++) {
        game[i].push({
            letter: word[8+i-start_point],
            number: 9+i-start_point,
        });
    };

    //add tiles irrelevant to the solution
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    for (let i=0; i<3; i++) {
        let num = random_seeded(8);
        if (game[num].length < 3) {
            game[num].unshift({
                letter: letters[random_seeded(26)],
                number: 8+i,
            });
        };
    };

    //make random, backward moves on virtual puzzle to scramble it
    const correct_number = (num) => {
        if (num<0) {
            return 7;
        } else if (num>7) {
            return 0;
        } else {
            return num;
        };
    };
    const make_move = (index,index1,possibilities) => {
        let selected_box = game[index].pop();
        game[index1].push(selected_box);
    };
    let num_moves = 20;
    for (let i=0; i<num_moves; i++) {
        let rand_num = random_seeded(8)
        let selected_position = game[rand_num];
        if (game[rand_num].length===0) {
            num_moves++;
            continue;
        };
        let possibilities = [];
        if (game[correct_number(rand_num-1)].length >= selected_position.length-1) {
            possibilities.push(correct_number(rand_num-1));
        };
        if (game[correct_number(rand_num+1)].length >= selected_position.length-1) {
            possibilities.push(correct_number(rand_num+1));
        };
        if (possibilities.length<1) {
            //num_moves++;
            continue;
        } else {
            possibilities.forEach((pos)=>{
                if (game[pos].length>=3) {
                    possibilities.splice(possibilities.indexOf(pos),1);
                };
            });
            if (possibilities.length<1) {
                continue;
            };
            make_move(rand_num,possibilities[random_seeded(possibilities.length)]);
        };
    };

    //convert scrambled puzzle into a format that puz-led_main functions can read correctly
    let box_list1 = [];
    game.forEach((pos)=>{
        pos.forEach((tile)=>{
            tile.index = pos.indexOf(tile)+1;
            tile.position = positions[game.indexOf(pos)];
            box_list1.push(tile);
        });
    });
    box_list = [];
    for (let i=0; i<box_list1.length+1; i++) {
        for (let n=0; n<box_list1.length; n++) {
            if (box_list1[n].number===i) {
                box_list.push(box_list1[n]);
                break;
            };
        };
    };
};
generate_puzzle(day_seed);

