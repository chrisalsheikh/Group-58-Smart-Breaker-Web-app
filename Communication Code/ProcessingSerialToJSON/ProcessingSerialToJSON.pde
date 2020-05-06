//I dont know javaScript very well, so this code is a modified version of a stack exchange forum post => https://electronics.stackexchange.com/questions/54/saving-arduino-sensor-data-to-a-text-file

import processing.serial.*;
Serial mySerial;
PrintWriter output;
void setup() {
   mySerial = new Serial( this, Serial.list()[0], 19200 ); //Baudrate changed to match what is being received
   output = createWriter( "data.json" );  //Changed to output json file format
}
void draw() {
    if (mySerial.available() > 0 ) {
         String value = mySerial.readString();
         if ( value != null ) {
              output.println( value );
         }
    }
}

void keyPressed() {
    output.flush();  // Writes the remaining data to the file
    output.close();  // Finishes the file
    exit();  // Stops the program
}
