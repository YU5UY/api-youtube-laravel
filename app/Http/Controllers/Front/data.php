<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class data extends Controller
{
    //

    //Enter here your api key which you got it from google
    public $api_key = "";
    private function returnID(Request $request){
        $url = $request -> url;
        preg_match_all("/https?:\/\/(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch\?v=)([^&]+)/i",$url,$id);
        $id = $id[1][0];
        return $id;
    }
    private function returnData(Request $request){
        global $api_key;
        $id = $this -> returnID($request);
        $api = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=$id&key=$api_key";
        $data = file_get_contents($api);
        $data = json_decode($data,1);
        if ($data["pageInfo"]["totalResults"] == 0){
            return ["error" => 404];
        }else return $data;
    }
    public function returnFiltredData(Request $request){
        $mainData = $this -> returnData($request);
        if (array_key_exists("error" ,$mainData)) return $mainData;
        $title = $mainData["items"][0]["snippet"]["title"];
        $description = $mainData["items"][0]["snippet"]["description"];
        $thumbnail = end($mainData["items"][0]["snippet"]["thumbnails"])["url"];
        if (array_key_exists("tags",$mainData["items"][0]["snippet"])){
            $tags = $mainData["items"][0]["snippet"]["tags"];
        }else $tags = "not found";
        $statics = $mainData["items"][0]["statistics"];

        $jsonData = [
            "title" => $title,
            "description" => $description,
            "thumbnail" => $thumbnail,
            "tags" => $tags,
            "statics" => $statics
        ];
        return $jsonData;
    }
}
