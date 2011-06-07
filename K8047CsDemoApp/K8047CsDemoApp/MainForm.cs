/*
 * Example of Velleman K8047 DLL access in C#.
 * ---------
 * 
 * Project: Enregistreur Piscine
 * Copyright (C) 2011 ralfoide gmail com,
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


using System;
using System.Reflection;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

// Startup logic for K8047CsDemoApp is located in: 
// K8047CsDemoApp_MainForm_Initialize();
// Any Visual Studio Project User Settings used here can be changed by using Visual Studio:

// File -> Project -> K8047CsDemoApp Properties -> Settings

// NOTES: 1. Click on name at the top to sort Settings by name.
//        2. Use your Mouse to expand and contract the settings columns drag the columns.
//        3. You do NOT need to re-build after changing settings.

// Some Microsoft ClickOnce Settings are Pre-Set and can be changed by using Visual Studio:

// File -> Project -> K8047CsDemoApp Properties -> Publish

// This (K8047CsDemoApp_MainForm_Template) supports the following:

//  1. Visual Studio Project Template driven, create all future projects with this template.  
//  2. Startup normal or minimized using.
//  3. Supports single instance per system only setting.
//  4. All possible combinations of NotifyIcon and Taskbar logic.
//  5. All combinations of single/double left/right MouseClick assignments for Form1.
//  6. All combinations of single/double left/right MouseClick assignments for NotifyIcon.
//  7. Share ContextMenuStrips with Form1 and NotifyIcon.
//  8. Use different ContextMenuStrip with Form1 single left MouseClick.
//  9. Use different ContextMenuStrip with NotifyIcon single left MouseClick.
// 10. Restricted Exit logic, Exit only from ContextMenuStrip, not Form1.
// 11. Restricted Exit Warning Message via MessageBox.
// 12. Restricted Exit Warning Message via NotifyIcon BalloonTip, for vaiable time.
// 13. Totally Restricted Exit, NotifyIcon only, Initial Form then restrict or No Exit via GUI.
// 14. Total GUI Invisibility. Of course still stoppable by TaskManager and other programs.
// 15. Easy to use Visual Studio Project Templates, versions with and without comments.
// 16. 28 different Visual Studio Project User Settings, over 784+ different possible settings.
// 17. Change ANY of these settings without the need to re-build.
// 18. Completly tested, no focus problems, no event loops, no bugs. No Test or Debugging time.
// 19. Use this template to build an even more customized template for your future projects.
// 20. Includes Microsoft ClickOnce Deployment and Update Settings from Web Servers.

// Support for conflicting and/or overlapping project user setting logic is included in this
// template, by not setting anything that would make you accidentally invisible, an also by
// making some generic default choices when setting conflicts are encountered.

// The Visual Studio Project User Settings do what they say they do, when they are true or
// false. Change the settings, play with them. After changing any setting, simply use Visual
// Studio: Debug -> Start Debugging to see the differences using the new settings.

// Template (MainFormwc With Comments) Copyright By TheUberOverLord AKA Don Kennedy
// Project Name: K8047CsDemoApp
// More about MainFormwc can be found here, click the CTRL key
// in Visual Studio Editor while you MouseOver the link below:
// http://saveontelephoneservices.com/modules.php?name=News&file=article&sid=8

namespace K8047CsDemoApp {
    public partial class MainForm : Form {

        private k8047d mK8047 = null;
        private TextBox[] mTextVolt = new TextBox[4];
        private ListBox[] mListGain = new ListBox[4];
        private bool mInternalSelectionChange = false;

        public MainForm() {
            InitializeComponent();

            // fill in arrays for controls per channel
            int i = 0;
            mTextVolt[i++] = textVolt0;
            mTextVolt[i++] = textVolt1;
            mTextVolt[i++] = textVolt2;
            mTextVolt[i++] = textVolt3;

            i = 0;
            mListGain[i++] = listGain0;
            mListGain[i++] = listGain1;
            mListGain[i++] = listGain2;
            mListGain[i++] = listGain3;
            for (i = 0; i < 4; i++) {
                mInternalSelectionChange = true; 
                mListGain[i].SelectedIndex = 0;
                mInternalSelectionChange = false;
            }

            // We create our Closing event handler here.
            this.FormClosing += MainForm_Bye_Bye;
        }

        // **** Begin - Form1 NotifiyIcon, Taskbar, Startup and minimized or normal logic ****

        // Get our initial Exit logic from our project user properties.
        private bool MainForm_TimeToExit = Properties.Settings.Default.ExitAlways;

        // This event handler gets called when we receive any Close(); request.
        private void MainForm_Bye_Bye(object sender, FormClosingEventArgs e) {
            // If we do not honor a Close requests from Form1 using the "X" from
            // the top right of the Form1 Window do this. But this could be a system
            // shutdown request, or a process stop request, so, if this is NOT also a
            // UserClosing request, close as well, otherwise we could delay things like system
            // shutdown requests and stop requests.
            if ((!this.MainForm_TimeToExit)
                && (e.CloseReason == CloseReason.UserClosing)) {
                // If our NotifyIcon is not already in the System Tray, then make it
                // visible there now.
                if (!this.MainForm_NotifyIcon.Visible)
                    this.MainForm_NotifyIcon.Visible = true;

                // Should we display a NotifyIcon BalloonTip?
                if (Properties.Settings.Default.ExitWarningBalloonTipIsDisplayed)
                    this.MainForm_NotifyIcon.ShowBalloonTip
                        (Properties.Settings.Default.ExitWarningBalloonTipIsDisplayedForThisManyMilliseconds,
                         "K8047CsDemoApp",
                         "K8047CsDemoApp has minimized here, to the System Tray as an Icon."
                          + " Please left-click this K8047CsDemoApp Icon on the System Tray"
                          + " and choose Exit to exit.",
                         ToolTipIcon.Info);

                // Should we display a MessageBox?
                if (Properties.Settings.Default.ExitWarningMessageBoxIsDisplayed)
                    MessageBox.Show("K8047CsDemoApp has minimized to the System Tray as an Icon."
                        + "\r\n" +
                          "Please left-click the K8047CsDemoApp Icon on the System Tray"
                        + "\r\n" +
                          "and choose Exit to exit.");

                // Change our WindowState to be minimized.
                this.WindowState = FormWindowState.Minimized;

                // If we are visible then Hide(); this.Visible = false 
                // equals the same thing.
                if (this.Visible)
                    this.Hide();

                // This will Cancel this Close(); request, don't honor it.
                e.Cancel = true;
            } else {
                // We are going to honor this Close request.

                // Save ALL our project properties. We don't have to do this in this example,
                // but, we do it to show what you would do if you wanted to change any of
                // these settings and save them so that the next time you startup you do
                // things differently then using the settings you deployed with. This avoids
                // the need for registry settings to remember startup settings changed by
                // users.

                // For Example:

                // You could allow users to modify any setting by providing methods, such as 
                // check boxes to change their values. If you did that, this will save
                // any and all changes to any project properties that were changed
                // during this runtime, before we close, and they will be used next runtime.

                // If no changes were made, then the same settings you selected when you
                // published and deployed, will be used.
                Properties.Settings.Default.Save();

                // Turn off our NotifyIcon before we go away. Some programs do not
                // do this. You can tell this is the case, when a program is gone
                // yet the NotifyIcon for that program still remains in the System Tray
                // until you hover your mouse over it and then it goes away. This will
                // make sure our NotifyIcon goes away when our program goes away.
                if (this.MainForm_NotifyIcon.Visible)
                    this.MainForm_NotifyIcon.Visible = false;
            }
        }

        // This is redundant code , so we share it here, it is used by:
        // MainForm_Form1_Resize(); 
        // MainForm_Handle_Form1_Display();
        private void MainForm_ShowInTaskbar() {
            // If we show a Taskbar when minimized or normal and we are in that
            // WindowState now, then show us in the Taskbar.
            if (((this.WindowState == FormWindowState.Minimized)
                && (Properties.Settings.Default.ShowUsInTaskbarWhenMinimized))
                || ((this.WindowState == FormWindowState.Normal)
                    && (Properties.Settings.Default.ShowUsInTaskbarWhenNormal)))
                this.ShowInTaskbar = true;
        }

        // This event handler is fired by changes caused in WindowState by the "-" to
        // minimize on Form1, as well as the display and minimize menu items in the
        // ContextMenuStrips.
        private void MainForm_Form1_Resize(object sender, System.EventArgs e) {
            // Flip our contextMenuStrip1 text for this menu item. This menu item could
            // be in more than one ContextMenuStrip, but if we change it using the menu
            // item text for this.minimizeToolStripMenuItem.Text; it will be changed for the
            // ContextMenuStrips shared by Form1 or NotifyIcon.
            if (this.WindowState == FormWindowState.Minimized)
                this.minimizeToolStripMenuItem.Text = "Display K8047CsDemoApp";
            else
                this.minimizeToolStripMenuItem.Text = "Minimize";

            // Change our visibility if needed. Before we do, make sure we have a NotifyIcon
            // visible.
            if ((this.MainForm_NotifyIcon.Visible)
                && (this.Visible)
                && (this.WindowState == FormWindowState.Minimized)
                && (!Properties.Settings.Default.ShowUsInTaskbarWhenMinimized))
                this.Hide();

            // Remove our Taskbar item if needed and also if needed make sure
            // that Form1 is now in focus. Before we do, make sure we have a NotifyIcon
            // visible.
            if ((this.MainForm_NotifyIcon.Visible)
                && (this.ShowInTaskbar)
                && (this.WindowState == FormWindowState.Normal)
                && (!Properties.Settings.Default.ShowUsInTaskbarWhenNormal)) {
                // Remove us from the Taskbar.
                this.ShowInTaskbar = false;

                // Check If we are in Focus and if not
                // Activate the form.
                if (!this.Focused)
                    this.Activate();
            }

            // Add our Taskbar item if needed.
            if (!this.ShowInTaskbar)
                this.MainForm_ShowInTaskbar();
        }

        // This handles any WindowState request changes we get from both MouseClicks on 
        // NotifyIcon as well as our shared or not shared ContextMenuStrip Items from 
        // NotifyIcon and Form1.
        private void MainForm_Handle_Form1_Display() {
            // Toggle our WindowState to the opposite of what it is now.
            // If we are going from a minimized to normal display state, make sure we can be
            // seen and that Form1 is also now in Focus as well.
            if (this.WindowState == FormWindowState.Minimized) {
                // If we started minimized with only a NotifyIcon located in the System Tray,
                // then we never invoked MainForm_Form1_Resize(); yet, because we
                // set it as a event handler after MainForm_Initial_Display_Logic();
                // was invoked, to avoid MainForm_Form1_Resize(); getting involved
                // at startup, because MainForm_Form1_Resize(); will change the
                // Form1 display to the opposite of what it was, when invoked, so we delay
                // making it an event handler until the initial starup display logic is in
                // place, because of that, we need to set our ContextMenuStrip text to minimize
                // the first time we are displayed as normal here, if needed.

                // Flip our contextMenuStrip1 text for this menu item. This menu item could
                // be in more than one ContextMenuStrip, but if we change it using the menu
                // item text for this.minimizeToolStripMenuItem.Text, it will be changed for
                // the ContextMenuStrips shared by Form1 or NotifyIcon.
                if (this.minimizeToolStripMenuItem.Text != "Minimize")
                    this.minimizeToolStripMenuItem.Text = "Minimize";

                // If we were hidden then make us visible, Show(); is equal to               
                // this.visible = true. 
                if (!this.Visible)
                    this.Show();
                // Check If we are in Focus as well if not
                // Activate the form.
                if (!this.Focused)
                    this.Activate();

                // Change our WindowState to normal display.
                this.WindowState = FormWindowState.Normal;

                // Add our Taskbar item if needed. Form Resize is not called
                // first time so we do it here for that reason as well.
                if (!this.ShowInTaskbar)
                    this.MainForm_ShowInTaskbar();
            } else
                // Change our WindowState to display minimized.
                this.WindowState = FormWindowState.Minimized;
        }

        // This sets our initial starup use of NotifyIcon and Taskbar at program startup.
        private void MainForm_Initial_Display_Logic() {
            // If we are going to be invisible do this.
            if (Properties.Settings.Default.StartUsTotallyInvisible) {
                // Hide us.
                this.Visible = false;
                // Remove us from the Taskbar.
                this.ShowInTaskbar = false;
                // Hide our NotifyIcon.
                this.MainForm_NotifyIcon.Visible = false;
                // Change our WindowState to Minimized.
                this.WindowState = FormWindowState.Minimized;
            } else {
                // Check for settings that could accidentally make us invisible
                // If we find them then make sure we don't let that happen.
                if ((Properties.Settings.Default.ShowUsInTaskbarWhenMinimized)
                    && (Properties.Settings.Default.ShowUsInTaskbarWhenNormal)
                    && (!Properties.Settings.Default.ShowSystemTrayNotifyIcon))
                    this.MainForm_NotifyIcon.Visible = false;
                else
                    this.MainForm_NotifyIcon.Visible = true;

                // If we are starting minimized or normal and have a NotifyIcon
                // but want no Taskbar then remove our Taskbar Item and make us invisible
                // for the moment. But, make sure our settings are set to show a NotifyIcon.
                if ((Properties.Settings.Default.ShowSystemTrayNotifyIcon)
                    && (((Properties.Settings.Default.StartUsMinimized)
                        && (!Properties.Settings.Default.ShowUsInTaskbarWhenMinimized))
                        || ((!Properties.Settings.Default.StartUsMinimized)
                            && (!Properties.Settings.Default.ShowUsInTaskbarWhenNormal)))) {
                    // Hide us.
                    this.Visible = false;
                    // Remove us from the Taskbar.
                    this.ShowInTaskbar = false;
                }

                // If we start minimized, then set our WindowState to Minimized now.
                if (Properties.Settings.Default.StartUsMinimized)
                    this.WindowState = FormWindowState.Minimized;
                else {
                    // We are going to start as normal display. Change our ContextMenuStrip
                    // item text so that when we are being displayed normal we show minimize
                    // as the Context Menu Item text. 
                    this.minimizeToolStripMenuItem.Text = "Minimize";

                    // Display Form1 as normal display Show(); is equal to this.Visible = true;
                    this.Show();
                    // Bring Form1 into focus.
                    this.Activate();
                }

                // If we are supposed to have a NotifyIcon in the System Tray
                // turn it on now.
                if (Properties.Settings.Default.ShowSystemTrayNotifyIcon)
                    this.MainForm_NotifyIcon.Visible = true;
            }
        }

        // **** End - Form1 NotifiyIcon, Taskbar, Startup and minimized or normal logic ****

        // **** Begin - Form1 and NotifyIcon MouseClicks and ContextMenuStrip display logic ****

        // Was our last MouseClick a left MouseClick?
        private bool MainForm_LastMouseClickWasLeft = false;

        // Did our last MouseClick come from NotifyIcon?
        private bool MainForm_LastMouseClickFromNotifyIcon = false;

        // Was this a single or double MouseClick and were they from NotifyIcon?
        private bool MainForm_LastMouseClicksWereNotifyIconDoubleClicks = false;

        // This is redundant code, so we share it here, it is used by:
        // MainForm_contextMenuStrip1_Opening(); 
        // MainForm__MouseClick(); 
        // MainForm__MouseDoubleClick();
        private void MainForm_ActivateAndShow() {
            // When using NotifyIcon and dealing with MouseClicks
            // we need to always make sure Form1 is in Focus
            // after MouseClicks on NotifyIcon.
            if ((this.Visible == true)
            && (!this.Focused))
                this.Activate();
        }

        // This event handler can disable NotifyIcon single right MouseClicks for NotifyIcon
        // here, which means the normal ContextMenuStrip will not display when we right single
        // MouseClick NotifyIcon.

        // This can be also used to disable all MouseClicks on NotifyIcon if all other click
        // logic is false for NotifyIcon, which can be used for a monitoring program
        // that you may want the user to know is running, but not allow them to stop, using
        // the GUI, of course, if they have permission, they can still stop the process
        // using programs like the TaskManager.

        // Double right MouseClick logic remains active even when a single right MouseClick
        // is disabled for both NotifyIcon as well as Form1. So you can still select a
        // right double MouseClick project user setting for NotifyIcon and Form1 even when
        // single right MouseClick have been disabled.

        // We don't want to stop ALL displays of the ContextMenuStrip from say a left 
        // MouseClick or left/right double MouseClick, which is a selectable project user
        // setting in this example. We also do not want to limit the ability of Form1 to use a
        // single right MouseClick to display the ContextMenuStrip if or when needed.

        // We use some MouseClick information obtained from MainForm_MouseDown();
        // which is fired for both single and double MouseDown events for NotifyIcon and 
        // is used to help us determine where the MouseClick came from, Form1 or the NotifyIcon
        // as well as which mouse button was clicked, left or right, and was it a single
        // or a double MouseClick.
        private void MainForm_contextMenuStrip1_Opening(object sender, System.ComponentModel.CancelEventArgs e) {
            // Make sure this was a single or double right MouseClick.
            // Was the last MouseClick on NotifyIcon? It could have been on Form1.
            // Are single right MouseClicks disabled?
            // Are single double right MouseClicks for ContextMenuStrips enabled?
            if ((!this.MainForm_LastMouseClickWasLeft)
                 && (this.MainForm_LastMouseClickFromNotifyIcon)
                 && (Properties.Settings.Default.NotifyIconMouseSingleRightClickDisabled)
                 && ((!this.MainForm_LastMouseClicksWereNotifyIconDoubleClicks)
                     || ((this.MainForm_LastMouseClicksWereNotifyIconDoubleClicks)
                         && (!Properties.Settings.Default.NotifyIconMouseDoubleRightClickShowsContextMenuStrip)))) {
                // Stop the ContextMenuStrip from being visible.
                this.MainForm_contextMenuStrip1.Visible = false;

                // Don't honor this ContextMenuStrip display request.
                e.Cancel = true;

                // When using NotifyIcon and dealing with MouseClicks
                // we need to always make sure Form1 is in Focus
                // after MouseClicks on NotifyIcon.
                if (this.WindowState == FormWindowState.Normal)
                    this.MainForm_ActivateAndShow();
            }
        }

        // This is redundant code, so it is shared here, and used by:
        // MainForm_MouseClick();
        // MainForm_MouseDoubleClick();
        // To dislay a NotifyIcon ContextMenuStrip for MouseClicks other than single right
        // MouseClicks on NotifyIcon.
        private void MainForm_DisplayNotifyIconContextMenu(object sender) {
            // This is a very neat way for displaying a ContextMenuStrip from
            // NotifyIcon MouseClicks other than single right MouseClicks, it uses
            // System Reflection. Positioning is automatic as well this way.

            // Declare locals.
            NotifyIcon eventSource = null;
            Type niHandle = null;

            // Cast the event sender back to a NotifyIcon
            // for the sake of convienience.
            eventSource = (NotifyIcon)sender;

            // Get the type instance from the NotifyIcon.
            niHandle = eventSource.GetType();

            // Invoke the private ShowContextMenu method.
            niHandle.InvokeMember(
                    "ShowContextMenu",
                    BindingFlags.Instance |
                    BindingFlags.NonPublic |
                    BindingFlags.InvokeMethod,
                    null,
                    eventSource,
                    null
                    );
        }

        // This event handler handles our MouseDown events for both Form1 and NotifyIcon.

        // We use this event handler to help us keep track of where the MouseClick came from,
        // Form1 or NotifyIcon as well as what Mouse Button was pressed, Left or Right,
        // and was this a double or single MouseDown event, which is only important
        // if we have single right MouseClicks disabled for NotifyIcon but have double right
        // MouseClicks enabled for NotifyIcon to display the ContextMenuStrip.
        private void MainForm_MouseDown(object sender, System.Windows.Forms.MouseEventArgs e) {
            // If this event was fired from NotifyIcon then do this.
            if (sender == this.MainForm_NotifyIcon) {
                // Our Last Mouse Clicks came from NotifyIcon.
                this.MainForm_LastMouseClickFromNotifyIcon = true;

                // Was this a single MouseClick or a double MouseClick for ContextMenuStrip
                // display purposes? We come here twice on double MouseClicks once as 
                // Clicks = 1 and once as Clicks = 2. 

                // MainForm_contextMenuStrip1_Opening(); is also called twice
                // for double right MouseClicks, but always after this event fires, so the
                // second time if Clicks = 2 and double right MouseClicks on NotifyIcon are
                // set to display the MainForm_contextMenuStrip1; we need to set
                // this before MainForm_contextMenuStrip1_Opening(); fires to
                // allow double right MouseClicks on NotifyIcon to display the 
                // MainForm_ContextMenuStrip1; if needed. If you wish to use this
                // Clicks count for other things, you will need to verify the order in
                // which other Mouse events fire, which was also tested in this case.
                if (e.Clicks == 2)
                    this.MainForm_LastMouseClicksWereNotifyIconDoubleClicks = true;
                else
                    this.MainForm_LastMouseClicksWereNotifyIconDoubleClicks = false;
            } else
                // This MouseDown did not come from NotifyIcon.
                this.MainForm_LastMouseClickFromNotifyIcon = false;

            // Was it a left or right MouseDown?
            if (e.Button == MouseButtons.Left)
                this.MainForm_LastMouseClickWasLeft = true;
            else
                this.MainForm_LastMouseClickWasLeft = false;
        }

        // This event handler handles single MouseClicks for both Form1 and our NotifyIcon.

        // Currently this example shows how to assign a different ContextMenuStrip for single 
        // left MouseClicks on NotifyIcon and Form1. The same could be done for single right
        // and or double left and right MouseClicks as well.

        // Note: This event handler fires twice for double MouseClicks.
        private void MainForm_MouseClick(object sender, MouseEventArgs e) {
            // Check to see if we should minimize or display Form1 normally.
            if (((sender == this.MainForm_NotifyIcon)
                && (((Properties.Settings.Default.NotifyIconMouseSingleLeftClickShowsForm1)
                    && (this.MainForm_LastMouseClickWasLeft))
                    || ((Properties.Settings.Default.NotifyIconMouseSingleRightClickShowsForm1)
                        && (!this.MainForm_LastMouseClickWasLeft))))
                || ((sender == this)
                    && (((Properties.Settings.Default.Form1MouseSingleRightClickMinimizesForm1)
                        && (!this.MainForm_LastMouseClickWasLeft))
                        || ((Properties.Settings.Default.Form1MouseSingleLeftClickMinimizesForm1)
                            && (this.MainForm_LastMouseClickWasLeft))))) {
                // Toggle Form1 display from minimized - normal - minimized.
                this.MainForm_Handle_Form1_Display();

                // If sender equals Form1 then we just minimized Form1, so return now, because
                // we never want to attempt to display a ContextMenuStrip for Form1 when it is
                // minimized, as we could if we continued and our settings were set to attempt
                // to do this accidently as well as minimize for the same MouseClicks.

                // Whereas supporting two functions for NotifyIcon for the same MouseClicks,
                // might be acceptable and is possible to support properly.
                if (sender == this)
                    return;
            }

            // This handles our display of ContextMenuStrips for both Form1 and NotifyIcon when
            // single MouseClicks are set to true to display the ContextMenuStrip in the
            // Visual Studio Project User Settings.

            // NotifyIcon single right MouseClicks are automatically handled by the NotifyIcon
            // class, which is why you see us look only for left MouseClicks for NotifyIcon
            // and both left and right MouseClicks for Form1.

            // This example supports a different ContextMenuStrip for single left MouseClicks
            // for both NotifyIcon and Form1.
            if (((sender == this.MainForm_NotifyIcon)
                && (!this.MainForm_NotifyIcon.ContextMenuStrip.Visible)
                && (this.MainForm_LastMouseClickWasLeft)
                && (Properties.Settings.Default.NotifyIconMouseSingleLeftClickShowsContextMenuStrip))
                || ((sender == this)
                    && (!this.ContextMenuStrip.Visible)
                    && (((Properties.Settings.Default.Form1MouseSingleLeftClickShowsContextMenuStrip)
                        && (this.MainForm_LastMouseClickWasLeft))
                        || (!Properties.Settings.Default.Form1MouseSingleRightClickDisabled)
                            && (!this.MainForm_LastMouseClickWasLeft)))) {
                // Display the ContextMenuStrip for NotifyIcon.
                if (sender == this.MainForm_NotifyIcon) {
                    // This handles support of multiple ContextMenuStrips here we show an
                    // example of assigning a different ContextMenuStrip for a single left
                    // MouseClick on NotifyIcon.
                    if (Properties.Settings.Default.NotifyIconMouseSingleLeftClickUsesDifferentContextMenuStrip)
                        this.MainForm_NotifyIcon.ContextMenuStrip = this.MainForm_contextMenuStrip2;

                    // Display the ContextMenuStrip for left single MouseClicks.
                    this.MainForm_DisplayNotifyIconContextMenu(sender);

                    // This puts the normal ContextMenuStrip back for NotifyIcon after we 
                    // displayed a different one.
                    if (Properties.Settings.Default.NotifyIconMouseSingleLeftClickUsesDifferentContextMenuStrip)
                        this.MainForm_NotifyIcon.ContextMenuStrip = this.MainForm_contextMenuStrip1;
                } else
                    // Display the ContextMenuStrip for Form1.
                    if (sender == this) {
                        // Replace the Empty ContextMenuStrip for Form1 with a real one. See 
                        // K8047CsDemoApp_MainForm_Initialize();
                        // for more details on why we need to do this.
                        if (Properties.Settings.Default.Form1MouseSingleLeftClickUsesDifferentContextMenuStrip)
                            this.ContextMenuStrip = this.MainForm_contextMenuStrip2;
                        else
                            this.ContextMenuStrip = this.MainForm_contextMenuStrip1;

                        // Display the ContextMenuStrip for left single MouseClicks.
                        this.ContextMenuStrip.Show(Control.MousePosition);

                        // This puts an Empty ContextMenuStrip back for Form1 after we displayed
                        // a real one. So that we do not lose MouseClick events for Form1.
                        this.ContextMenuStrip = new ContextMenuStrip();
                    }
            }

            // When using NotifyIcon and dealing with MouseClicks
            // we need to always make sure Form1 is in Focus
            // after MouseClicks on NotifyIcon.
            if (this.WindowState == FormWindowState.Normal)
                this.MainForm_ActivateAndShow();
        }

        // This event handler handles both left and right double MouseClicks for Form1
        // and NotifyIcon.
        private void MainForm_MouseDoubleClick(object sender, MouseEventArgs e) {
            // This handles our display Of Form1 when NotifyIcon or Form1 is double
            // MouseClicked.
            if (((sender == this.MainForm_NotifyIcon)
                && (((Properties.Settings.Default.NotifyIconMouseDoubleLeftClickShowsForm1)
                    && (this.MainForm_LastMouseClickWasLeft))
                    || ((Properties.Settings.Default.NotifyIconMouseDoubleRightClickShowsForm1)
                        && (!this.MainForm_LastMouseClickWasLeft))))
                || ((sender == this)
                    && (((Properties.Settings.Default.Form1MouseDoubleRightClickMinimizesForm1)
                        && (!this.MainForm_LastMouseClickWasLeft))
                        || ((Properties.Settings.Default.Form1MouseDoubleLeftClickMinimizesForm1)
                            && (this.MainForm_LastMouseClickWasLeft))))) {
                // Toggle Form1 display from minimized - normal - minimized.
                this.MainForm_Handle_Form1_Display();

                // If sender equals Form1 then we just minimized Form1, so return now, because
                // we never want to attempt to display a ContextMenuStrip for Form1 when it is
                // minimized, as we could if we continued and our settings were set to
                // attempt to do this accidently as well as minimize for the same MouseClicks.

                // Whereas supporting two functions for NotifyIcon for the same MouseClicks,
                // might be acceptable and is possible to support properly.
                if (sender == this)
                    return;
            }

            // This handles our display of the ContextMenuStrip when NotifyIcon is double
            // MouseClicked.
            if (((sender == this.MainForm_NotifyIcon)
                && (((Properties.Settings.Default.NotifyIconMouseDoubleLeftClickShowsContextMenuStrip)
                    && (this.MainForm_LastMouseClickWasLeft))
                    || ((Properties.Settings.Default.Form1MouseDoubleRightClickShowsContextMenuStrip)
                        && (!this.MainForm_LastMouseClickWasLeft))))
                || ((sender == this)
                    && (((Properties.Settings.Default.Form1MouseDoubleRightClickShowsContextMenuStrip)
                        && (!this.MainForm_LastMouseClickWasLeft))
                        || ((Properties.Settings.Default.Form1MouseDoubleLeftClickShowsContextMenuStrip)
                            && (this.MainForm_LastMouseClickWasLeft)))))
                // If this came from NotifyIcon then do this.
                if (sender == this.MainForm_NotifyIcon)
                    this.MainForm_DisplayNotifyIconContextMenu(sender);
                else
                    // If this came from Form1. Do this.
                    if (sender == this) {
                        // Replace the empty ContextMenuStrip for Form1 with a real one.
                        // See K8047CsDemoApp_MainForm_Initialize(); for
                        // more details on why we need to do this.
                        this.ContextMenuStrip = this.MainForm_contextMenuStrip1;

                        // Display the ContextMenuStrip on Form1 at current MousePostion.
                        this.ContextMenuStrip.Show(Control.MousePosition);

                        // This puts an empty ContextMenuStrip back for Form1 after we displayed
                        // a real one. So that we do not lose MouseClick events for Form1. 
                        this.ContextMenuStrip = new ContextMenuStrip();
                    }

            // When using NotifyIcon and dealing with MouseClicks
            // we need to always make sure Form1 is in Focus
            // after MouseClicks on NotifyIcon.
            if (this.WindowState == FormWindowState.Normal)
                this.MainForm_ActivateAndShow();
        }

        // **** End - Form1 and NotifyIcon MouseClicks and ContextMenuStrip display logic. ****

        // **** Begin - Our ContextMenuStrip Item Click Handlers. ****

        // *** You will want to change or remove this for each project ***
        // About was selected from the ContextMenuStrip.
        private void MainForm_aboutToolStripMenuItem_Click(object sender, EventArgs e) {
            MessageBox.Show("Simple app demonstrating Velleman K8047/PCS10 access in C#");
        }

        // Exit was selected from our ContextMenuStrip. Normally the ContextMenuStrip is
        // shared by NotifyIcon and Form1 so this menu item could have been selected
        // from both of them. Our second ContextMenuStrip example does not support an
        // exit, just close, so this is our only menu item Exit logic, currently, we force
        // TimeToExit = true; here which means that when we received a Exit request from
        // any ContextMenuStrip, we will honor it, this logic also could be changed as well.
        private void MainForm_exitToolStripMenuItem_Click(object sender, EventArgs e) {
            // Make sure we Close, Force this close.
            this.MainForm_TimeToExit = true;

            // Create a Close request.
            this.Close();
        }

        // We received a minimize or display normal request that was selected from
        // our ContextMenuStrips. This could be from both Form1 and NotifyIcon.
        private void MainForm_minimizeToolStripMenuItem_Click_1(object sender, EventArgs e) {
            // Handle a ContextMenuStrip item minimize or normal display request.
            this.MainForm_Handle_Form1_Display();
        }
        // **** End - Our ContextMenuStrip item click event handlers. ****

        // **** Our Program Entry Point. ****

        // We added a line Under Form1.Designer.cs to invoke this:
        // this.Load += new System.EventHandler(this.K8047CsDemoApp_MainForm_Initialize);
        private void K8047CsDemoApp_MainForm_Initialize(object sender, System.EventArgs e) {
            // Make sure that standard and standard double clicks are enabled,
            // if they are not enabled, enable them. This really is OverKill but better to be
            // safe than sorry.
            if (!this.GetStyle(ControlStyles.StandardClick))
                this.SetStyle(ControlStyles.StandardClick, true);

            if (!this.GetStyle(ControlStyles.StandardDoubleClick))
                this.SetStyle(ControlStyles.StandardDoubleClick, true);

            // Initialize both ContextMenuStrips for NotifyIcon and Form1.
            // Form1 as being Empty, to avoid any problems later with null values.

            // We need to play some games with the Form1 assigned ContextMenuStrip. 
            // We need to assign it on the fly, and make it Empty afterwards because we lose
            // Form1 MouseClick events if we let a ContextMenuStrip stay assigned. Also, 
            // we can't leave it as a null because we use "if" logic on if it is visible,
            // which still works if it is Empty, but NOT if it is null and not assigned to
            // something, so we need to make it Empty 
            // this.ContextMenuStrip = new ContextMenuStrip(); so that we do not generate a
            // null exception when we query if it is visible or not in 
            // MainForm_MouseClick(); This is a great example showing
            // what can happen when things are not initialized, and how they can cause you
            // problems later on in your code under the right conditions, like checking if the
            // Form1 ContextMenuStrip is visible, this would build fine but create a null
            // exception later.
            this.ContextMenuStrip = new ContextMenuStrip();

            // We can share this same this.contextMenuStrip1; on the fly, later with Form1.
            // See the MainForm_MouseClick(); and 
            // MainForm__MouseDoubleClick(); event handlers for how and when.

            // Any changes to the ContextMenuStrips can be easily done using the Visual Studio
            // designer. this.MainForm_contextMenuStrip1; is the normal shared
            // contextMenuStrip and MainForm_contextMenuStrip2; is used as the
            // different shared ContextMenuStrip and menu items can easily be added or deleted
            // using the Visual Studio Designer to both of these ContextMenuStrips. 
            this.MainForm_NotifyIcon.ContextMenuStrip = this.MainForm_contextMenuStrip1;

            // All of our Mouse event handlers for Form1 and NotifyIcon are shared
            // to save code and space. It just is not possible to share single and double
            // click Mouse event handlers, otherwise we would have done that as well.

            // Form1 event handlers. Also See the Form1 Resize event below which needs to be
            // set later. Notice how these Mouse Events share the same event handler with
            // MainForm_NotifyIcon; below.
            this.MouseClick += new System.Windows.Forms.MouseEventHandler(this.MainForm_MouseClick);
            this.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.MainForm_MouseDoubleClick);
            this.MouseDown += new System.Windows.Forms.MouseEventHandler(this.MainForm_MouseDown);

            // MainForm_NotifyIcon; event handlers.
            this.MainForm_NotifyIcon.MouseClick += new System.Windows.Forms.MouseEventHandler(this.MainForm_MouseClick);
            this.MainForm_NotifyIcon.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.MainForm_MouseDoubleClick);
            this.MainForm_NotifyIcon.MouseDown += new System.Windows.Forms.MouseEventHandler(this.MainForm_MouseDown);

            // MainForm_contextMenuStrip1; item event handlers we need and use. 
            // See Form1.Designer.cs you can delete any of these ContextMenuStrip menu items
            // easliy as well.

            // this.MainForm_contextMenuStrip1.Opening; is used to trap a single
            // right MouseClick on MainForm_NotifyIcon; and stop the normal
            // ContextMenuStrip from being displayed if the Project User Settings are set to
            // disable single right MouseClicks on NotifyIcon.
            this.MainForm_contextMenuStrip1.Opening += new System.ComponentModel.CancelEventHandler(this.MainForm_contextMenuStrip1_Opening);
            this.aboutToolStripMenuItem.Click += new System.EventHandler(this.MainForm_aboutToolStripMenuItem_Click);
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.MainForm_exitToolStripMenuItem_Click);
            this.minimizeToolStripMenuItem.Click += new System.EventHandler(this.MainForm_minimizeToolStripMenuItem_Click_1);

            // Our Taskbar and NotifyIcon minimize or normal display startup
            // logic for Form1.
            this.MainForm_Initial_Display_Logic();

            // We are single threaded and this is the easiest method for us not to create
            // any Form1 lag problems. Sleazy or not, it works :P
            System.Windows.Forms.Application.DoEvents();

            // Form1 Resize event handler. 
            // NOTE: Must be after our intital display logic
            // otherwise if it was before, it will cause logic problems.
            this.Resize += new System.EventHandler(this.MainForm_Form1_Resize);

            // We now at this point, are completely event driven.
        }

        private void listGain0_SelectedIndexChanged(object sender, EventArgs e) {
            changeGain(0);
        }

        private void listGain1_SelectedIndexChanged(object sender, EventArgs e) {
            changeGain(1);
        }

        private void listGain2_SelectedIndexChanged(object sender, EventArgs e) {
            changeGain(2);
        }

        private void listGain3_SelectedIndexChanged(object sender, EventArgs e) {
            changeGain(3);
        }

        private void checkLed_CheckedChanged(object sender, EventArgs e) {
            if (connect()) {
                mK8047.Led = checkLed.Checked;
                mStatusText.Text = "LED changed";
            }
        }

        private void buttonQuit_Click(object sender, EventArgs e) {
            MainForm_exitToolStripMenuItem_Click(sender, e);
        }

        private void buttonAcquire_Click(object sender, EventArgs e) {
            acquire();
        }

        private void buttonConnect_Click(object sender, EventArgs e) {
            connect();
        }

        private bool connect() {
            if (mK8047 == null) {
                try {
                    mK8047 = new k8047d();
                    mK8047.start();
                    for (int i = 0; i < 4; i++) {
                        mK8047.setChannelGain(i, 3);
                        mInternalSelectionChange = true;
                        mListGain[i].SelectedIndex = 0;
                        mInternalSelectionChange = false;
                    }
                    mStatusText.Text = "Connected";
                } catch (Exception e) {
                    mStatusText.Text = e.Message;
                }
            }
            return mK8047 != null && mK8047.Started; ;
        }

        private void changeGain(int channel) {
            if (!mInternalSelectionChange && connect()) {
                string value = mListGain[channel].SelectedItem as string;
                int maxVolts = Convert.ToInt32(value.Replace('V', ' ').Trim());
                mK8047.setChannelGain(channel, maxVolts);
                mStatusText.Text = String.Format("Gain changed on {0} to {1} V", channel, maxVolts);
            }
        }

        private void acquire() {
            if (connect()) {
                double[] volts = mK8047.read();

                for (int i = 0; i < 4; i++) {
                    mTextVolt[i].Text = String.Format("{0:0.00} V", volts[i]);
                }

                int[] seq = mK8047.LastSequence;
                mTextSeq0.Text = Convert.ToString(seq[0]);
                mTextSeq1.Text = Convert.ToString(seq[1]);
            }
        }

        public void Dispose() {
            if (mK8047 != null) {
                mK8047.Dispose();
                mK8047 = null;
            }
            base.Dispose();
        }
        
    }
}