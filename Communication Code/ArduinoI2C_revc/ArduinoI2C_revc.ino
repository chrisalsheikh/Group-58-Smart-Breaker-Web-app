 #include <Wire.h>
#include <ArduinoJson.h>
byte x, x1, x2, x3;

void setup() {
 Wire.begin(); //initialize wire library
 Wire.setClock(100000); //Set frequency
 Serial.begin(9600); //for output to serial monitor


}

void loop() {

 uint8_t numDevices = 1;
 uint8_t devAddresses[numDevices] = {0x61};  //Array to hold multiple devices in final version
 uint32_t data;
 
while(1){
 
 data = readActivePowerAvgOneMin(devAddresses[0]);
 delay(100);

  DynamicJsonBuffer jBuffer(1024);
  JsonObject& Power = jBuffer.createObject();

  Power["Room ID"] = "Living Room";
  Power["Device ID"] = devAddresses[0];
  Power["Watts"] = data;

 // Power.prettyPrintTo(Serial);
  Power.printTo(Serial);
  Serial.println();
  delay(1000);
/*
Serial.println();
 Serial.print("data = "); 
  Serial.print(data, HEX);
  Serial.println();
  delay(1000);
  */
}
}

uint32_t readRegister(uint8_t deviceAddress, uint8_t registerAddress){
  uint32_t data = 0x00000000;
  bool errorFlag;
  Wire.beginTransmission(deviceAddress);
  Wire.write(registerAddress);
  errorFlag = Wire.endTransmission();

    if(errorFlag == 0){
      byte x0, x1, x2, x3;
      Wire.requestFrom(deviceAddress, 4);
      x0 = Wire.read();
      x1 = Wire.read();
      x2 = Wire.read();
      x3 = Wire.read();
/*
Serial.print("data0 = "); 
  Serial.print(x3, HEX);
  Serial.println();
  Serial.print("data1 = "); 
  Serial.print(x2, HEX);
  Serial.println();
  Serial.print("data2 = "); 
  Serial.print(x1, HEX);
  Serial.println();
  Serial.print("data3 = "); 
  Serial.print(x0, HEX);
  Serial.println();Serial.println();
  delay(10000);
  //data = data | ((x0<<24) | (x1<<16) | (x2<<8) | (x3);//dont think this does what i want it to, so I seperated the statements to avoid losing data
  data = data | (x0<<24);
  data = data | (x1<<16);
  data = data | (x2<<8);
  data = data | x3;
  */
  data = data*256 + x0;
  data = data*256 + x1;
  data = data*256 + x2;
  data = data*256 + x3;
  /*
  Serial.print("dataTOTAL = ");  Serial.print(data, HEX);  Serial.println();Serial.println();
  */
 }
    else{}
    return data;
    }

uint32_t writeBlockData(){
  
}

uint32_t writeaccessCode(){
  
}

uint32_t writeRegister(){
  
}

uint32_t readActivePowerAvgOneMin(uint8_t deviceAddress){
  uint32_t data = 0x00000000;
  data = readRegister(deviceAddress, 0x29); 
  data = data & 0x0001FFFF; // this value is stored in the bottom half in 17 bits
  return data;
}

uint32_t readPF(uint8_t deviceAddress){
  uint32_t data = 0x0000;
  data = readRegister(deviceAddress, 0x29); 
  data = data & 0x7FF; // this value is stored in the bottom half in 11 bits
}
