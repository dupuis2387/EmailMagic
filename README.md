# Email Magic
Some tips and tricks for marketing email magic. 
This repo is to support both articles here:

https://hubpages.com/technology/Dynamic-email-images-and-other-fancy-analytical-features-that-you-can-easilyDIY
(which they keep pulling for some reason?)

or the less prestigious version, here
https://medium.com/@dupuis2387/dynamic-images-in-emails-and-other-fancy-analytical-features-that-you-can-easily-diy-28b5dc3a96f0



# Demystifying some email tips tricks, and magic 
So, for a while now, a part of my job has included doing the coding part of marketing emails. 
I've done it for about 8 years or more, now, I think. 
And after a while, it gets boring and repetitive. 

You might get tired of being on the receiving end of them, and I might tired of rolling my eyes when I get the content that I need to plug into an email template. But, every once in a while you see something interesting.

I'm a member of a gym, let's call it Schmanet Ritness (legal purposes, I don't want my tucchus sued, and I don't know if I can name them). Because of the 'rona outbreak going on, they've had to close all of their physical locations, which has really sucked. But, they've been amazingly decent, by freezing charges on the accounts of all members. And, on top of that, they've been doing public Facebook Live events, with simple at home workouts, open to anyone/everyone. 

This brings me to Schmanet Ritness' emails; emails that are notifying nature more than they are marketing (imho), that they send out to members, with a very fancy animated gif, that features a dynamic countdown timer. And, I was impressed. 
Seeing a countdown clock, as an image in this email, letting me know in XXhrs and YYminutes, a new FB live workout was waiting for me, is pretty dope.

# So let's get to the magic of how that works.

When you're coding an html email, and you put in an <img> tag in your source code, you point it to a url. 
Typically, it's a static image, like http://www.YourWebsite.com/images/image.jpg. 
You put that in your email, the email gets fired off, the person gets the email, their email client loads the email and downloads the image, to display. 

But…under the hood, downloading that image is still just a regular web request. 
Meaning, at the point the email client goes out and talks to your server, it can be context aware. 

Therefore, when the request comes in, you can for instance, intercept it on the server, determine originating information from what called it, and do conditional server side processing. 

For the  Schmanet Ritness emails, as it related to their countdown clock, a request to download the image comes to the server, the server runs some logic, like seeing what time it currently is on the server, probably a database call to tell what time the event is happening on FB, and finally, a call to a dynamic image generating library, like ImageMagick, will take care of rendering back the dynamic,necessary animated gif frames, that make up the image. 

(Now, they did apply sanity to this, by not rendering a "bajillion" frames, to account for every single second that makes up the time difference, and create a bloated large image file download.) So, if you try something like this, I suggest you use some sanity.

# Next up, want to determine if someone got your email and printed it? Well, there's a nice cheat for that too. 

For the marketing emails that I've done, I've had to add certain tracking pixels/code to the template, in order to capture some analytical data. 
Plenty of companies offer solutions for this. 
One such company (again, not going to name them directly) is "Bitmus". They offer plenty of cool tools, like being able to enter your email's source code into an online editor, tweak it, lint it, etc. and then fire off a bunch of real life tests to different VMs (i assume), that give back a screenshot of what your email looks like rendered in different email clients/devices. 

When you get ready to fire your email, you can add tracking code, that they generate for you. The tracking code includes one of those dynamic image tricks, that gets back the request on their server, and logs that your email was viewed/downloaded.

But, they also can tell you if some printed your email. Or, at least, intended to. They're able to do this, because part of the tracking code they give you, has a print only stylesheet. 
Something like :
```html
<style data-ignore-inlining>
@media print{ 
  #_t  
  { 
  background-image: url('https://url.com?someQueryString=yourRecipientsDynamicEmailAddressGoesHere');
  }
} 
div.OutlookMessageHeader 
{
 background-image:url('https://url.com?someQueryString=yourRecipientsDynamicEmailAddressGoesHere')
} 
table.moz-email-headers-table 
{
 background-image:url('https://url.com?someQueryString=yourRecipientsDynamicEmailAddressGoesHere')
} 
blockquote #_t {
 background-image:url('https://url.com?someQueryString=yourRecipientsDynamicEmailAddressGoesHere')
} 
#MailContainerBody #_t {
 background-image:url('https://url.com?someQueryString=yourRecipientsDynamicEmailAddressGoesHere')
}
</style>
<div id="_t"></div>
<img src="https://url.com?someQueryString=yourRecipientsDynamicEmailAddressGoesHere" width="1" height="1" border="0" />
```

So, we have a div and some print css. 
When someone goes to hit print, the print css is "activated", and via that background-image attribute, another context aware dynamic image call is made to the server, and analytics are recorded that someone printed your email. Or, again, at lest hit Ctrl/Cmd+P.

PS: All those other CSS selectors are used to tell what email client might have loaded the emails, 
since different clients like Outlook will inject their own html tags into your emails, 
automatically, and when the style rule encounters them, it fires off one of those 
dynamic image requests to the server, and just doesn&rsquo;t return anything, 
but maybe an invisible 1x1px image back.
