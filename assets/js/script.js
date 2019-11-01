var n=0;
var health=100;
var sp=10;
var d=500; // dificuldade
var Enemie=[];
var path={principal:"assets"};
	path.images=path.principal+"/images/";
	path.audio=path.principal+"/audio/";
	path.css=path.principal+"/css/";
	path.js=path.principal+"/js/";

// frames //
var specialFrame=0;
var music=false;

// check exist function onfullscreenchange:
if(document.onfullscreenchange===undefined)
	var fullscreenchange=false;

function CreateEnemie(){
	if($(".stage").length<9){
		$(".stage").append("<img src='"+path.images+"enemie_normal.png' class='Enemie' n='"+n+"' pass='20'>");
		Enemie[n]=setInterval('WalkEnemie('+n+')',d);
		n++;
	}
}

function KillEnemie(n){
	clearInterval(Enemie[n]);
	$(".Enemie[n='"+n+"']").remove();
}


function WalkEnemie(n){
	if(parseInt($(".Enemie[n='"+n+"']").attr("pass"))+1==parseInt($("#Iam").attr("pass")) || parseInt($(".Enemie[n='"+n+"']").attr("pass"))-1==parseInt($("#Iam").attr("pass")))
		return AttackEnemie(n);
	else if(parseInt($(".Enemie[n='"+n+"']").attr("pass"))>parseInt($("#Iam").attr("pass")))
		$(".Enemie[n='"+n+"']").attr("pass",parseInt($(".Enemie[n='"+n+"']").attr("pass"))-1);
	else
		$(".Enemie[n='"+n+"']").attr("pass",parseInt($(".Enemie[n='"+n+"']").attr("pass"))+1);
}
function AttackEnemie(n){
	$(".Enemie[n='"+n+"']").attr("src",path.images+"enemie_attack.png");
	var strength=5;
	IamDamage(strength);
	setTimeout(function(){$(".Enemie[n='"+n+"']").attr("src",path.images+"enemie_normal.png");},100);
}
function IamDamage(dmg){
	health-=dmg;
	if(health<=0 && health!='n'){ health='n'; alert(":: GAME OVER::\n\nVocê foi morto.\nScore: "+$("#score").html()); location.reload(true); }
	$("#health").width(health);
}
function StagesOfSpecial(){
	var f_pic=parseInt($(".Friend").attr("pic"))+1;
	var f_pic=(f_pic==8)?1:f_pic;
	if(specialFrame==5){
		var f_pass=parseInt($(".Friend").attr("pass"))+1;
		specialFrame=0;
	}else{
		var f_pass=parseInt($(".Friend").attr("pass"));
	}
	specialFrame++;
	$(".Friend").attr("src",path.images+"turtle_special"+f_pic+".png").attr("pic",f_pic).attr("pass",f_pass);
	if(f_pass==20){
		clearInterval(StagesInterval);
		$(".Friend").remove();
	}
	var v=parseInt($(".Friend").attr("pass"));
	var ens=$(".Enemie[pass='"+v+"'],.Enemie[pass='"+(v+1)+"'], .Enemie[pass='"+(v+2)+"']");
	$("#score").html(parseInt($("#score").html())+ens.length);
	ens.remove();
}

function fullscreen(){
	var e = document.body; // element
	(e.requestFullscreen && e.requestFullscreen())
	||
	(e.msRequestFullscreen && e.msRequestFullscreen())
	||
	(e.mozRequestFullScreen && e.mozRequestFullScreen())
	||
	(e.webkitRequestFullscreen && e.webkitRequestFullscreen());
}
function isFullscreen(){
	return Boolean(document.fullscreen || document.webkitFullscreen || document.mozFullScreen || document.msFullscreen);
}
function begin(){
	var full=1;
	var rotate=1;
	mobile=false;
	if(location.hash==""){
		if(!isFullscreen() && fullscreenchange)	full=0;
		if(window.innerWidth < window.innerHeight) rotate=0;
		if(window.innerWidth > 800) full=rotate=1; else mobile=true;
	}
	if(rotate==0) $(".mobile-menu p").show(); else  $(".mobile-menu p").hide();
	if(full==0 || rotate==0) $(".mobile-menu").show(); else{
		$(".mobile-menu").hide();
		$(".game").show();
		setInterval('CreateEnemie()',1000);
		CreateEnemie();
	}
}
function playMusicStage(){
	if(music) return;
	music=new Audio(path.audio+"stage3.mp3");
	music.loop=true;
	music.play();
}
document.onfullscreenchange = window.onresize = function(){ console.log(begin()); }

$(function(){

	$("#back").click(function(){
		if(parseInt($("#Iam").attr("pass"))>1)
		$("#Iam").attr("pass",parseInt($("#Iam").attr("pass"))-1);
	});
	$("#front").click(function(){
		pass_limit=(mobile==true)?14:18;
		if($("[pass='"+(parseInt($("#Iam").attr("pass"))+1)+"']").length==0 && parseInt($("#Iam").attr("pass"))<pass_limit)
			$("#Iam").attr("pass",parseInt($("#Iam").attr("pass"))+1);
	});
	$("#atk").click(function(){
		playMusicStage();
		$("#Iam").attr("src",path.images+"turtle_attack.png");
		var v=parseInt($("#Iam").attr("pass"));
		var ens=$(".Enemie[pass='"+v+"'],.Enemie[pass='"+(v+1)+"'], .Enemie[pass='"+(v+2)+"']");
		$("#score").html(parseInt($("#score").html())+ens.length);
		sp=(sp+ens.length>10)?10:sp+ens.length;
		if(sp==10)
			$("#sp").removeAttr("disabled");
		ens.remove();
		setTimeout(function(){$("#Iam").attr("src",path.images+"turtle_normal.png");},100);
		var punch=new Audio("assets/audio/punch.mp3");
		punch.play();
	});
	$("#sp").click(function(){
		if(sp==10){
			$(this).attr("disabled",true);
			$(".stage").append("<img src='"+path.images+"turtle_special1.png' pic='1' class='Friend' pass='0'>");
			StagesInterval=setInterval('StagesOfSpecial()',10);
			var punch=new Audio(path.audio+"special.mp3");
			punch.play();
			sp=0;
		}
	});
	setTimeout(function(){
		begin();
	},500);
});
