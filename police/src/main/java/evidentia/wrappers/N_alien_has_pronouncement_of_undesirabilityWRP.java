/*
 an auto-generated user wrapper template for the service 'N_alien_has_pronouncement_of_undesirability'
*/

package evidentia.wrappers;

import org.apache.commons.io.FileUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.net.*;
import java.io.*;
import java.util.*;

public class N_alien_has_pronouncement_of_undesirabilityWRP extends N_alien_has_pronouncement_of_undesirabilityETBWRP {

	@Override
	public void run(){
		if (mode.equals("+-")) {
			//do something
			try{
				System.out.println(in1);
				JSONParser parser = new JSONParser();
		                File file = new File(in1);
                		Object object = parser.parse(new FileReader(file));
                		JSONObject jsonobject = (JSONObject) object;
                		System.out.println(jsonobject.get("firstName"));
				System.out.println(jsonobject.get("applicationId"));
				if (jsonobject.get("firstName").toString().equals("Daniel") && jsonobject.get("lastName").toString().equals("Illner") && jsonobject.get("passportId").toString().equals("12345")){
					out2="true";
				} 
				else if(jsonobject.get("firstName").toString().equals("Max") && jsonobject.get("lastName").toString().equals("Muselmann") && jsonobject.get("passportId").toString().equals("54321")){
					out2="true";
				}
				else if(jsonobject.get("firstName").toString().equals("Karl-Heinz") && jsonobject.get("lastName").toString().equals("Heinrich") && jsonobject.get("passportId").toString().equals("238710")){
					out2="true";
				}
				else{
					out2="false";
				}

			}
			catch(Exception e){
				e.printStackTrace();
			}
		}
		else {
			System.out.println("unrecognized mode for N_alien_has_pronouncement_of_undesirability");
		}
	}
}
