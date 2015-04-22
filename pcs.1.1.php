<?php
    //version = 1.1
    $str=$_GET['text'];
/*
    # detect if the string was passed in as unicode
    $text_encoding = mb_detect_encoding($str, 'UTF-8, ISO-8859-1');
    # make sure it's in unicode
    if ($text_encoding != 'UTF-8') {
        $str = mb_convert_encoding($str, 'UTF-8', $text_encoding);
    }

    # html numerically-escape everything (&#[dec];)
    $str = mb_encode_numericentity($str,
        array (0x0, 0xffff, 0, 0xffff), 'UTF-8');
*/
    $fontsize=$_GET['size'];
    $dir=$_GET['dir'];
    $color=$_GET['color'];
    $fontname=$_GET['font'];
    $space=$_GET['space'];
    $length=strlen($str);
    $height=$fontsize;
    $c_red=hexdec(substr($color,0,2));
    $c_green=hexdec(substr($color,2,2));
    $c_blue=hexdec(substr($color,4,2));
    //var_dump($c_red);
    $width=$length*$fontsize;
    if($dir==1) {
        $img = imagecreatetruecolor($height*1.7, $width*1.5+$space*$length);
    }
    else {
        $img = imagecreatetruecolor($width*1.5+$space*$length, $height*1.7);
    }
    $white = imagecolorallocatealpha($img, 255, 255, 255,0);
    $black = imagecolorallocatealpha($img, 0,0,0,0);
    $transparent = imagecolorallocatealpha($img, 255, 255, 255,127);
    $c_color = imagecolorallocatealpha($img,$c_red,$c_green,$c_blue,0);
    $font_file = './fonts/'.$fontname;
    imagesavealpha ($img , true );
    imagefill($img,0,0,$transparent);
    if($dir==1)
    {
        if($str[0]<='z')
            imagefttext($img,$fontsize,270,$height*0.5,0,$c_color,$font_file,$str);
        else {
            for ($i = 0; $i < mb_strlen($str); $i++) {
                imagefttext($img, $fontsize, 0, 0, ($space+$height) *1.3*($i+1), $c_color, $font_file, mb_substr($str,$i,1,'utf-8'));
            }
        }
    }
    else {
        /*
         if($str[0]<='z')
         for ($i = 0; $i < strlen($str); $i++) {
         imagefttext($img, $fontsize,0, ($space + $height) * 1 * ($i),$height, $c_color, $font_file, $str[$i]);
         }
         */
        if($str[0]<='z')
            imagefttext($img,$fontsize,0,0,$height*1.2,$c_color,$font_file,$str);
        else {
            for ($i = 0; $i < mb_strlen($str); $i++) {
                imagefttext($img, $fontsize, 0, ($space + $height) *1.3*($i),$height*1.3, $c_color, $font_file, mb_substr($str,$i,1,'utf-8'));
            }
        }
    }
    
    ob_start();
    //imagecolortransparent($img,$white);
    //header('Content-Type:image/png');
    imagepng($img);
    $imagedata = ob_get_contents();
    ob_end_clean();
    echo 'data:image/png;base64,'.base64_encode($imagedata);
    imagedestroy($img);