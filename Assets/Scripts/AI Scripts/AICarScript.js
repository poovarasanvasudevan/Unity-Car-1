var centerOfMass : Vector3;  
var path : Array;  
var pathGroup : Transform;  
var maxSteer : float = 15.0;  
var wheelFL : WheelCollider;   
var wheelFR : WheelCollider;  
var wheelRL : WheelCollider;   
var wheelRR : WheelCollider;  
var currentPathObj : int;  
var distFromPath : float = 20;  
var maxTorque : float = 50;  
var currentSpeed : float;  
var topSpeed : float = 150;  
var decellarationSpeed : float = 10;  
var breakingMesh : Renderer;  
var idleBreakLight : Material;  
var activeBreakLight : Material;  
var isBreaking : boolean;  
var inSector : boolean;  
var sensorLength : float = 5;  
var frontSensorStartPoint : float = 5;  
var frontSensorSideDist : float = 5;  
var frontSensorsAngle : float = 30;  
var sidewaySensorLength : float = 5;  
private var flag : int = 0;  
  
function Start () {  
rigidbody.centerOfMass = centerOfMass;  
GetPath();  
}  
  
function GetPath (){  
var path_objs : Array = pathGroup.GetComponentsInChildren(Transform);  
path = new Array();  
  
for (var path_obj : Transform in path_objs){  
 if (path_obj != pathGroup)  
  path [path.length] = path_obj;  
}  
}  
  
  
function Update () {  
if (flag == 0)
GetSteer();  
Move();  
BreakingEffect ();  
Sensors();  
}  
  
function GetSteer(){  
var steerVector : Vector3 = transform.InverseTransformPoint(Vector3(path[currentPathObj].position.x,transform.position.y,path[currentPathObj].position.z));  
var newSteer : float = maxSteer * (steerVector.x / steerVector.magnitude);  
wheelFL.steerAngle = newSteer;  
wheelFR.steerAngle = newSteer;  
  
if (steerVector.magnitude <= distFromPath){  
currentPathObj++;  
if (currentPathObj >= path.length)  
currentPathObj = 0;  
} 
  
}  
  
function Move (){  
currentSpeed = 2*(22/7)*wheelRL.radius*wheelRL.rpm * 60 / 1000;  
currentSpeed = Mathf.Round (currentSpeed);  
if (currentSpeed <= topSpeed && !inSector){  
wheelRL.motorTorque = maxTorque;  
wheelRR.motorTorque = maxTorque;  
wheelRL.brakeTorque = 0;  
wheelRR.brakeTorque = 0;  
}  
else if (!inSector){  
wheelRL.motorTorque = 0;  
wheelRR.motorTorque = 0;  
wheelRL.brakeTorque = decellarationSpeed;  
wheelRR.brakeTorque = decellarationSpeed;  
}  
}  
  
function BreakingEffect (){  
if (isBreaking){  
breakingMesh.material = activeBreakLight;  
}  
else {  
breakingMesh.material = idleBreakLight;  
}  
  
}  
  
function Sensors(){  
flag = 0;  
var avoidSenstivity : float = 0;  
var pos : Vector3;  
var hit : RaycastHit;  
var rightAngle = Quaternion.AngleAxis(frontSensorsAngle,transform.up) * transform.forward;  
var leftAngle = Quaternion.AngleAxis(-frontSensorsAngle,transform.up) * transform.forward;  
  
//Front Mid Sensor  
pos = transform.position;  
pos += transform.forward*frontSensorStartPoint;  
if (Physics.Raycast(pos,transform.forward,hit,sensorLength)){  
  
Debug.DrawLine(pos,hit.point,Color.white);  
}  
  
//Front Straight Right Sensor  
pos += transform.right*frontSensorSideDist;  
  
if (Physics.Raycast(pos,transform.forward,hit,sensorLength)){  
if (hit.transform.tag != "Terrain"){  
flag++;  
avoidSenstivity -= 0.5;   
Debug.Log("Avoiding");  
Debug.DrawLine(pos,hit.point,Color.white);  
}  
}  
  
//Front Angled Right Sensor  
  
if (Physics.Raycast(pos,rightAngle,hit,sensorLength)){  
  
Debug.DrawLine(pos,hit.point,Color.white);  
}  
  
  
//Front Straight left Sensor  
pos = transform.position;  
pos += transform.forward*frontSensorStartPoint;  
pos -= transform.right*frontSensorSideDist;  
  
if (Physics.Raycast(pos,transform.forward,hit,sensorLength)){  
if (hit.transform.tag != "Terrain"){  
flag++;  
avoidSenstivity += 0.5;   
Debug.Log("Avoiding");  
Debug.DrawLine(pos,hit.point,Color.white);  
}  
}  
  
  
//Front Angled left Sensor  
if (Physics.Raycast(pos,leftAngle,hit,sensorLength)){  
  
Debug.DrawLine(pos,hit.point,Color.white);  
}  
  
//Right SideWay Sensor  
if (Physics.Raycast(transform.position,transform.right,hit,sidewaySensorLength)){  
  
Debug.DrawLine(transform.position,hit.point,Color.white);  
}  
  
  
//Left SideWay Sensor  
if (Physics.Raycast(transform.position,-transform.right,hit,sidewaySensorLength)){  
  
Debug.DrawLine(transform.position,hit.point,Color.white);  
}  
  
if (flag != 0)  
AvoidSteer (avoidSenstivity);  
}  
  
  
function AvoidSteer (senstivity : float){  
wheelFL.steerAngle = maxSteer*senstivity;  
wheelFR.steerAngle = maxSteer*senstivity;  
  
}  