/**
 * Class Controller - creating a object in charge with adding eventListeners for the 
 * keys that enable motion
 */
class Controller{
    /**
     * Controller constructor
     * @param {String} controllType
     */
    constructor(controllType){
        this.left = false;
        this.right = false;
        this.forward = false;
        this.back = false;
        switch(controllType){
            case "KEYS":
                this.#bindToKeys();
                break;
            
            case "BOOT":
                this.forward = true;
                break;
        }
    }

    #bindToKeys(){

        document.onkeydown = (event) => {
            switch (event.key){

                case "ArrowRight":
                case "d": 
                    this.right = true;
                    break;
                case "ArrowLeft":
                case "a":
                    this.left = true;
                    break;
                case "ArrowUp":
                case "w":
                    this.forward = true;
                    break;
                case "ArrowDown":
                case "s": 
                    this.back = true;
                    break;
        
            }

        };


        document.onkeyup = (event) => {
            switch (event.key){

                case "ArrowRight":
                case "d":
                    this.right = false;
                    break;
                case "ArrowLeft":
                case "a":
                    this.left = false;
                    break;
                case "ArrowUp":
                case "w":
                    this.forward = false;
                    break;
                case "ArrowDown":
                case "s": 
                    this.back = false;
                    break;
            }

        }
    }
   
}