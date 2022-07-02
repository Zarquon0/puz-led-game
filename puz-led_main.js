/* This file, as opposed to puzzle_generator, handles all
DOM interactions and in-game logic. */

//help button functionality
const help = document.getElementById('help');
let switch1 = 'on';
const help_popup = () => {
    if (switch1 === 'on') {
        document.getElementsByTagName('main')[0].style.display = 'none';
        document.getElementsByTagName('article')[0].style.display = 'block';
        help.src = 'close.png';
        switch1 = 'off';
    } else {
        document.getElementsByTagName('main')[0].style.display = 'flex';
        document.getElementsByTagName('article')[0].style.display = 'none';
        help.src = 'doubts-button.png';
        switch1 = 'on';
    };
};
help.addEventListener('click',help_popup);

let moves;
let attempts;
let all_boxes;
let boxes_html;
let context;
let setup_boxes_html;
const render_puzzle = () => {
    //handlebars box setup
    const source = document.getElementById('boxes').innerHTML;
    const template = Handlebars.compile(source);
    let counter = -1;
    let number_count = 19
    const blank_factory = () => {
        counter++
        number_count++
        return {
            letter: ' ',
            index: 0,
            position: positions[counter],
            number: number_count,
        };
    };
    box_list.forEach((box1)=>{
        box1.start_position = box1.position;
        box1.start_index = box1.index;
    });
    context = {
        blanks: [blank_factory(),blank_factory(),blank_factory(),blank_factory(),blank_factory(),blank_factory(),blank_factory(),blank_factory()],
        box: box_list,
    };
    all_boxes = box_list.concat(context.blanks);
    const compiledHTML = template(context);
    document.getElementById('game').innerHTML = compiledHTML;

    //sidebar setup
    moves = 0;
    attempts = 1;
    document.getElementById('attempts').innerHTML = `${attempts}`;
    document.getElementById('word').innerHTML = word.slice(0,2).toUpperCase()+'---'+word.slice(word.length-2,word.length).toUpperCase();

    //box starting position/z-index setup
    boxes_html = Array.from(document.getElementsByClassName('box')).concat(Array.from(document.getElementsByClassName('blank')));
    setup_boxes_html = (list_boxes) => {
        for (let i=0; i<list_boxes.length; i++) {
            let box = list_boxes[i];
            let html_box = document.getElementById(`${box.number}`);
            html_box.style.gridArea = `${box.position[0]}/${box.position[1]}/${box.position[0]+1}/${box.position[1]+1}`;
            html_box.style.zIndex = `${box.index}`;
        };
    };
    setup_boxes_html(all_boxes);
};
render_puzzle();

 //victory logic
const victory = () => {
    let vic_screen = document.createElement('div');
    vic_screen.id = 'victory';
    vic_screen.innerHTML = `<h1 class='victory'>Solved!</h1> <p class='victory'>It took you ${moves} moves and ${attempts} attempts</p>`;
    document.body.appendChild(vic_screen);
}
const victory_check = () => {
    let boxes_by_position = []
    for (let i=0; i<positions.length; i++) {
        boxes_by_position.push(all_boxes.filter((box1)=>{return `${box1.position}`===`${positions[i]}`}));
    };
    boxes_by_position = boxes_by_position.map((boxes1)=>{return boxes1.reduce((x,y)=>{return(x.index>y.index ? x : y)})});
    let letters = '';
    boxes_by_position.forEach((box1)=>{
        letters += `${box1.letter}`
    });
    letters = letters.concat(letters);
    for (let i=0; i<8; i++) {
        if (letters.slice(i,i+word.length)===word) {
            victory();
        };
    };
};

/* box functionality */

//resets all boxes to unselected state
const to_default = () => {
    for (let i=0; i<boxes_html.length; i++) {
        let current_box = boxes_html[i];
        let grid_area = current_box.style.gridArea;
        let z_index = current_box.style.zIndex;
        current_box.style = '';
        current_box.style.gridArea = grid_area;
        current_box.style.zIndex = z_index;
        if (`${current_box.children.length}` !== '0') {
            current_box.children[0].innerHTML = `(${z_index})`
        };
        if (`${current_box.className}`==='box') {
            current_box.addEventListener('click',box_selection);
            current_box.removeEventListener('click',to_default);
        };
        current_box.removeEventListener('click',finish_move);
    };
};

//handles logic for when a tile highlighted blue is selected
const finish_move = (box_event) => {
    let endpoint = box_event.target;
    if (`${endpoint.className}` === 'height') {
        endpoint = endpoint.parentNode;
    };
    selected_box.style.gridArea = endpoint.style.gridArea;
    let grid_area = selected_box.style.gridArea
    let grid_area_string = `${grid_area}`;
    selected_box_JS.position = [parseInt(grid_area_string.slice(0,1)),parseInt(grid_area_string.slice(4,5))];
    selected_box.style.zIndex = `${parseInt(endpoint.style.zIndex)+1}`;
    selected_box_JS.index = parseInt(selected_box.style.zIndex);
    moves++;
    document.getElementById('moves').innerHTML = `${moves}`;
    to_default();
    victory_check();
};

//handles logic for when tile is clicked
let selected_box;
let selected_box_JS;
const box_selection = (box_event) => {
    selected_box = box_event.target;
    if (`${selected_box.className}` === 'height') {
        selected_box = selected_box.parentNode;
    };
    selected_box_JS = box_list[parseInt(selected_box.id)-1];
    for (let i=0; i<boxes_html.length; i++) {
        let box = boxes_html[i]
        if (`${box.className}`==='box') {
            box.removeEventListener('click',box_selection);
        };
    };
    selected_box.addEventListener('click',to_default);
    let adjacent_positions;
    switch (`${selected_box_JS.position}`) {
        case ('1,1'):
            adjacent_positions = [[2,1],[1,2]];
            break;
        case ('1,2'):
            adjacent_positions = [[1,1],[1,3]];
            break;
        case ('1,3'):
            adjacent_positions = [[1,2],[2,3]];
            break;
        case ('2,3'):
            adjacent_positions = [[1,3],[3,3]];
            break;
        case ('3,3'):
            adjacent_positions = [[2,3],[3,2]];
            break;
        case ('3,2'):
            adjacent_positions = [[3,3],[3,1]];
            break;
        case ('3,1'):
            adjacent_positions = [[3,2],[2,1]];
            break;
        case ('2,1'):
            adjacent_positions = [[3,1],[1,1]];
            break;
    };
    let adjacent_boxes = all_boxes.filter((box1)=>{return `${box1.position}`===`${adjacent_positions[0]}`});
    let adjacent_boxes1 = all_boxes.filter((box1)=>{return `${box1.position}`===`${adjacent_positions[1]}`});
    let top_box = adjacent_boxes.reduce((x,y)=>{return(x.index>y.index ? x : y)});
    let top_box1 = adjacent_boxes1.reduce((x,y)=>{return(x.index>y.index ? x : y)});
    let top_boxes_draft = [top_box,top_box1];
    let top_boxes = top_boxes_draft.filter((box1)=>{return box1.index<selected_box_JS.index});
    top_boxes.forEach((box1)=>{
        let box1_html = document.getElementById(`${box1.number}`);
        box1_html.style.border = '3px solid blue';
        box1_html.style.backgroundColor = 'rgba(111,173,243,1)';
        box1_html.addEventListener('click',finish_move);
    }); 
    /*let irrelevant_boxes = JSON.parse(JSON.stringify(box_list));
    irrelevant_boxes.splice(selected_box_JS.number-1,1);
    top_boxes.forEach((box1)=>{
        try {
            irrelevant_boxes.splice(irrelevant_boxes.indexOf(box1),1)
        } catch (err) {console.log(err)};
    });*/
    let irrelevant_boxes = box_list.filter((box1)=>{
        if (box1.number!==selected_box_JS.number) {
            return true;
        } else {
            return false;
        };
    });
    for (let i=0; i<top_boxes.length; i++) {
        for (let n=0; n<irrelevant_boxes.length; n++) {
            if (irrelevant_boxes[n].number===top_boxes[i].number) {
                irrelevant_boxes.splice(n,1);
            };
        };
    };
    irrelevant_boxes.forEach((box1)=>{
        let box1_html = document.getElementById(`${box1.number}`);
        box1_html.style.filter = 'brightness(0.5)';
    });
};
to_default()

//retry button functionality
const attempts_change = () => {
    attempts++;
    document.getElementById('attempts').innerHTML = `${attempts}`;
    switch (`${attempts}`) {
        case '2':
            document.getElementById('word').innerHTML = word.slice(0,2).toUpperCase()+'--'+word.slice(word.length-3,word.length).toUpperCase();
            break;
        case '3':
            document.getElementById('word').innerHTML = word.slice(0,3).toUpperCase()+'-'+word.slice(word.length-3,word.length).toUpperCase();
            break;
        default:
            document.getElementById('word').innerHTML = word.toUpperCase();
    };
};
const restart = () => {
    moves = 0;
    document.getElementById('moves').innerHTML = `${moves}`
    attempts_change()
    box_list.forEach((box1)=>{
        box1.position = box1.start_position;
        box1.index = box1.start_index;
    });
    all_boxes = box_list.concat(context.blanks);
    setup_boxes_html(box_list);
    to_default();
};
document.getElementById('retry').addEventListener('click',restart);

//seeding puzzle regeneration
const seed_form = document.getElementById('seed_form');
const submit_button = document.getElementById('submit');
const puzzle_regeneration = () => {
    let new_seed = parseInt(seed_form.elements[0].value);
    let new_seed_string = `${new_seed}`;
    if (new_seed_string !== 'NaN' && new_seed_string.length<=8) {
        generate_puzzle(new_seed);
        render_puzzle();
        to_default();
    };
};
submit_button.addEventListener('click',puzzle_regeneration)
