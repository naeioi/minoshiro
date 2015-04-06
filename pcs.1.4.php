<?php
    //version = 1.3
    //A trial to get the right scale of the image
    $str=$_GET['text'];
    $fontsize=$_GET['size'];
    $dir=$_GET['dir'];
    $color=$_GET['color'];
    $fontname=$_GET['font'];
    $space=$_GET['space'];
    $length=strlen($str);
    $font_file = './'.$fontname.'.ttf';
    $c_red=hexdec(substr($color,0,2));
    $c_green=hexdec(substr($color,2,2));
    $c_blue=hexdec(substr($color,4,2));
    $height=$fontsize;
    $width=$length*$fontsize;
    
    if($dir==1) {
        $img = imagecreatetruecolor($height*1.5, $width*1.5+$space*$length);
    }
    else {
        $img = imagecreatetruecolor($width*1.5+$space*$length, $height*1.5);
    }
    
    $white = imagecolorallocatealpha($img, 255, 255, 255,0);
    $black = imagecolorallocatealpha($img, 0,0,0,0);
    $transparent = imagecolorallocatealpha($img, 255, 255, 255,127);
    $c_color = imagecolorallocatealpha($img,$c_red,$c_green,$c_blue,0);
    
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
        if($str[0]<='z')
            imagefttext($img,$fontsize,0,0,$height,$c_color,$font_file,$str);
        else {
            for ($i = 0; $i < mb_strlen($str); $i++) {
                imagefttext($img, $fontsize, 0, ($space + $height) *1.3*($i),$height*1.3, $c_color, $font_file, mb_substr($str,$i,1,'utf-8'));
            }
        }
    }
    //End of vendering
    list($t,$r,$b,$l)=trimImage($img,0);
    $w = $r-$l; // find width
    $h = $b-$t; // find height
    $dst_img=imagecreatetruecolor($w,$h);
    imagesavealpha ($dst_img , true );
    $transparent = imagecolorallocatealpha($dst_img, 255, 255, 255,127);
    imagefill($dst_img,0,0,$transparent);
    imagecopy($dst_img,$img,0,0,$l,$t,$w,$h);
    ob_start();
    //imagecolortransparent($img,$white);
    //header('Content-Type:image/png');
    imagepng($dst_img);
    $imagedata = ob_get_contents();
    ob_end_clean();
    echo 'data:image/png;base64,'.base64_encode($imagedata);
    imagedestroy($img);
    imagedestroy($dst_img);
    
    function trimImage(&$im) {
        // if tolerance ($t) isn't a number between 0 - 255 use 10 as default
        $w = imagesx($im); // image width
        $h = imagesy($im); // image height
        $top=0;$right=0;$bottom=0;$left=0;
        for($y=$h-1;$y>=0;$y--)
        {
            $succeed=0;
            for($x=0;$x<$w;$x++)
            {
                $rgb = imagecolorat($im, $x, $y);
                $alpha = ($rgb >> 24) & 0x7F;
                if ($alpha != 127)
                {
                    
                    //var_dump($bottom);
                    $bottom=$y;
                    $succeed=1;
                    break;
                }
            }
            if($succeed==1)break;
        }
        for($y=0;$y<$h;$y++)
        {
            $succeed=0;
            for($x=0;$x<$w;$x++)
            {
                $rgb = imagecolorat($im, $x, $y);
                $alpha = ($rgb >> 24) & 0x7F;
                if ($alpha != 127)
                {
                    $top=$y;
                    $succeed=1;
                    break;
                }
            }
            if($succeed==1)break;
        }
        for($x=$w-1;$x>=0;$x--)
        {
            $succeed=0;
            for($y=$top;$y<$bottom;$y++)
            {
                $rgb = imagecolorat($im, $x, $y);
                $alpha = ($rgb >> 24) & 0x7F;
                if ($alpha != 127)
                {
                    $right=$x;
                    $succeed=1;
                    break;
                }
            }
            if($succeed==1)break;
        }
        $left=0;
        return array($top,$right+1,$bottom+1,$left);
    }
    
