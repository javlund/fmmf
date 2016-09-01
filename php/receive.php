<?php

header('Content-Type: application/json');

$f3 = require("../vendor/bcosca/fatfree-core/base.php");

$db = new \DB\SQL('mysql:host=mysql8.unoeuro.com;port=3306;dbname=avlund_dk_db','avlund_dk','yiarh');

class Member extends \DB\SQL\Mapper {
    public function __construct() {
        global $db;
        parent::__construct($db, 'fmmf_members');
    }
}

class MembersREST {
    function get($f3) {
        $id = $f3->get("PARAMS.id");
        $member = new Member();
        $member->load(array('ID=?', $id));
        if($member->dry()) {
            echo json_encode(array("status" => "Member with ID ".$id." does not exist."));
            return;
        }
        echo json_encode(array("member" => $member->cast()));
    }
    function post($f3) {
        $member = new Member();
        $member->name = $f3->get("POST.name");
        $member->email = $f3->get("POST.email");
        $member->address = $f3->get("POST.address");
        $member->city = $f3->get("POST.city");
        $member->zip = $f3->get("POST.zip");
        $member->country = $f3->get("POST.country");
        $member->birthdate = $f3->get("POST.birthdate");
        $member->joindate = $f3->get("POST.joindate");
        $member->created = time();
        $member->save();

        $mailToUser = <<<USERMAIL
        Tak fordi du meldte dig ind i Friends of Metal Magic Festival!

        Dette er dine brugerinformationer:

        Navn: $member->name
        E-mail: $member->email
        Adresse: $member->address
        By: $member->city
        Postnummer: $member->zip
        Land: $member->country
        
        Du hører fra os, når vi har bekræftet dit medlemskab.

        Med venlig hilsen,
        Friends of Metal Magic Festival

        ------------------    ENGLISH    --------------------

        Thank you for joining Friends of Metal Magic Festival!

        This is your user information:

        Name: $member->name
        E-mail: $member->email
        Address: $member->address
        City: $member->city
        Zip code: $member->zip
        Country: $member->country

        We will be in touch once we have confirmed your membership.

        Kind regards,
        Friends of Metal Magic Festival

USERMAIL;

        mail($member->name."<".$member->email.">", "Velkommen til Friends of Metal Magic", $mailToUser, "From: Friends of Metal Magic<jtroelsgaard@gmail.com>\r\ncc: Friends of Metal Magic<jtroelsgaard@gmail.com>");

        echo json_encode(array('status' => 'OK, saved as id '.$member->ID));
    }
    function put($f3) {
        $member = new Member();
        $member->find(array('ID', $f3->get("PUT.id")));
    }
    function delete($f3) {
        $member = new Member();
        $member->find(array('ID', $f3->get("DELETE.id")));
    }
    static function getAll() {
        $member = new Member();
        echo json_encode(array_map(array($member,'cast'),$member->find()));
    }
    static function mailAll() {
      $member = new Member();
      $members = array_map(array($member,'cast'),$member->find());
      //echo json_encode($members);
      foreach ($members as $k => $m) {
        $email = $m["email"];
        $name = $m["name"];
      }
        $mailToUser = <<<THANKSMAIL
--- ENGLISH VERSION BELOW ---

Kære kommende medlem i Friends of Metal Magic.

For det første tak for en fantastisk festival! Det var en perfekt afslutning på den æra det har været, at komme på Metal Magic Festival på Ungdommens Hus i Fredericia.
Nu skydes en ny æra i gang, hvor festivalen skal stå på egne ben. Og derfor har festivalarrangørerne brug for jeres hjælp! Det er nemlig ikke en billig affære at starte fra bunden på den måde. Så for at festivalen kan fortsætte med samme høje kvalitet som den er kendt for, skal der samles nogle midler ind.

Vi er derfor helt ubeskrivelig glade for, at du har valgt at støtte op om vores lille projekt med Friends of Metal Magic, så vi kan få sendt nogle penge i festivalens retning. Det sikrer nemlig, at vi kan ses igen til næste år til endnu et brag af en metalfestival!

For at færdiggøre din tilmelding til foreningen, skal du sende medlemskontingentet på kr. 200 til følgende Paypal konto: friendsofmetalmagic@gmail.com

Når vi har modtaget din indbetaling, vil du modtage en bekræftelsesmail fra os med dit medlemsnummer.

Igen mange tak for din støtte!

Cheers 
Bestyrelsen
(The Friends of Metal Magic Crew)

--- ENGLISH VERSION ---

Dear future member of Friends of Metal Magic,

First of all, thank you for an amazing festival! It was a perfect closure of an era - the Metal Magic Festival at Ungdommens Hus in Fredericia.
Now, another era is forthcoming, and the festival is about to break free and stand on its own feet. Which is why the festival organisers need your help! You see, it’s not exactly cheap to start from the bottom up. Thus, in order for the festival to continue delivering the same impressive quality that it’s known for, we need to gather some funds.

We are indescribably happy that you have chosen to support our little project Friends of Metal Magic in order for us to be able to send some money to the festival. This will ensure that we can see each other again next year for another blast of a metal festival!

To complete your registration for the organisation, please pay the membership fee of €25 to the following Paypal-account: friendsofmetalmagic@gmail.com

Once we have received your payment, you will receive a confirmation e-mail from us with your member ID.

Again, your support is very much appreciated!

Cheers
The board
(The Friends of Metal Magic Crew)
THANKSMAIL;
        
        mail("Jacob Avlund<jacob@avlund.dk>", "Medlemskab i Friends of Metal Magic", $mailToUser, "From: Friends of Metal Magic<jtroelsgaard@gmail.com>");

        echo json_encode(array('status' => 'OK'));
      
    }
}


$f3->route("GET /test", function () {
    echo "test";
});

$f3->map("/members/@id", "MembersREST");

$f3->route("GET /members", "MembersREST::getAll");

$f3->route("GET /mailall", "MembersREST::mailAll");

$f3->run();

?>
