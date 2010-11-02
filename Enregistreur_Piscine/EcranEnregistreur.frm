VERSION 5.00
Begin VB.Form FormMain 
   Caption         =   "Enregistreur Piscine"
   ClientHeight    =   8490
   ClientLeft      =   1485
   ClientTop       =   1875
   ClientWidth     =   13200
   Icon            =   "EcranEnregistreur.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   8490
   ScaleWidth      =   13200
   Begin VB.TextBox mTextTemp 
      Height          =   285
      Left            =   7560
      TabIndex        =   33
      Top             =   7440
      Width           =   735
   End
   Begin VB.PictureBox mPicture 
      BackColor       =   &H00C0FFFF&
      BorderStyle     =   0  'None
      Height          =   1935
      Index           =   2
      Left            =   120
      ScaleHeight     =   129
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   720
      TabIndex        =   30
      Top             =   4440
      Width           =   10800
   End
   Begin VB.CommandButton mBtnEraseEventList 
      Caption         =   "Vider liste"
      Height          =   375
      Left            =   11640
      TabIndex        =   29
      Top             =   7560
      Width           =   1335
   End
   Begin VB.ListBox mListEvents 
      Height          =   7080
      Left            =   11040
      TabIndex        =   28
      Top             =   360
      Width           =   2055
   End
   Begin VB.CheckBox mCheckSimulation 
      Caption         =   "Simulation"
      Height          =   375
      Left            =   3360
      TabIndex        =   21
      Top             =   7560
      Width           =   1215
   End
   Begin VB.PictureBox mPicture 
      BackColor       =   &H00FFFFC0&
      BorderStyle     =   0  'None
      Height          =   1575
      Index           =   1
      Left            =   120
      ScaleHeight     =   105
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   720
      TabIndex        =   12
      Top             =   2400
      Width           =   10800
   End
   Begin VB.Frame Frame2 
      Caption         =   "Paramètres"
      Height          =   855
      Left            =   1920
      TabIndex        =   9
      Top             =   6600
      Width           =   2655
      Begin VB.TextBox mTextThreshold 
         Alignment       =   1  'Right Justify
         Height          =   285
         Left            =   1200
         TabIndex        =   25
         Text            =   "10"
         Top             =   360
         Width           =   975
      End
      Begin VB.Label Label24 
         Caption         =   "V"
         Height          =   255
         Left            =   2280
         TabIndex        =   26
         Top             =   405
         Width           =   255
      End
      Begin VB.Label Label23 
         Caption         =   "Seuil Marche"
         Height          =   255
         Left            =   120
         TabIndex        =   24
         Top             =   360
         Width           =   1095
      End
   End
   Begin VB.Timer mTimer1 
      Enabled         =   0   'False
      Interval        =   60000
      Left            =   11040
      Top             =   7560
   End
   Begin VB.CommandButton mBtnStop 
      Caption         =   "Arrêter"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   240
      TabIndex        =   8
      Top             =   7440
      Width           =   1455
   End
   Begin VB.Frame Frame1 
      Caption         =   "Dernière Données Enregistreur"
      Height          =   1455
      Left            =   4680
      TabIndex        =   3
      Top             =   6480
      Width           =   6255
      Begin VB.CommandButton mBtnUpdateNow 
         Caption         =   "Mettre à jour"
         Height          =   375
         Left            =   4560
         TabIndex        =   22
         Top             =   555
         Width           =   1455
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   1
         Left            =   2040
         TabIndex        =   19
         Top             =   600
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   0
         Left            =   1200
         TabIndex        =   18
         Top             =   600
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   3
         Left            =   3720
         TabIndex        =   17
         Top             =   600
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   2
         Left            =   2880
         TabIndex        =   16
         Top             =   600
         Width           =   735
      End
      Begin VB.TextBox mTextLoggerIndex 
         Height          =   285
         Left            =   240
         TabIndex        =   14
         Top             =   600
         Width           =   735
      End
      Begin VB.Label mLabelTime 
         Alignment       =   1  'Right Justify
         Caption         =   "(heure)"
         Height          =   255
         Left            =   4560
         TabIndex        =   20
         Top             =   240
         Width           =   1455
      End
      Begin VB.Label Label36 
         Caption         =   "Index"
         Height          =   255
         Left            =   240
         TabIndex        =   15
         Top             =   360
         Width           =   735
      End
      Begin VB.Label Label4 
         Caption         =   "CH1"
         Height          =   195
         Left            =   1440
         TabIndex        =   7
         Top             =   360
         Width           =   375
      End
      Begin VB.Label Label5 
         Caption         =   "CH2"
         Height          =   195
         Left            =   2280
         TabIndex        =   6
         Top             =   360
         Width           =   375
      End
      Begin VB.Label Label6 
         Caption         =   "CH3"
         Height          =   195
         Left            =   3120
         TabIndex        =   5
         Top             =   360
         Width           =   375
      End
      Begin VB.Label Label7 
         Caption         =   "CH4"
         Height          =   195
         Left            =   3960
         TabIndex        =   4
         Top             =   360
         Width           =   375
      End
   End
   Begin VB.PictureBox mPicture 
      BackColor       =   &H00C0FFC0&
      BorderStyle     =   0  'None
      Height          =   1575
      Index           =   0
      Left            =   120
      ScaleHeight     =   105
      ScaleMode       =   0  'User
      ScaleWidth      =   720
      TabIndex        =   2
      Top             =   360
      Width           =   10800
   End
   Begin VB.CheckBox mCheckLED 
      Caption         =   "Allumer LED"
      Height          =   375
      Left            =   1920
      TabIndex        =   1
      Top             =   7560
      Width           =   1215
   End
   Begin VB.CommandButton mBtnStart 
      Caption         =   "Démarrer"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   240
      TabIndex        =   0
      Top             =   6600
      Width           =   1455
   End
   Begin VB.Label Label2 
      Caption         =   "CH3: Température"
      Height          =   255
      Left            =   120
      TabIndex        =   32
      Top             =   4200
      Width           =   1815
   End
   Begin VB.Label Label1 
      Caption         =   "CH2: M/A pompe"
      Height          =   255
      Left            =   120
      TabIndex        =   31
      Top             =   2160
      Width           =   1815
   End
   Begin VB.Label Label25 
      Caption         =   "Evènements"
      Height          =   255
      Left            =   11160
      TabIndex        =   27
      Top             =   120
      Width           =   2055
   End
   Begin VB.Label mLabelError 
      Caption         =   "(error placeholder)"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H000000FF&
      Height          =   375
      Left            =   4080
      TabIndex        =   23
      Top             =   8040
      Width           =   9015
   End
   Begin VB.Label Label11 
      Caption         =   "CH1: M/A chauffage"
      Height          =   255
      Left            =   240
      TabIndex        =   13
      Top             =   120
      Width           =   1815
   End
   Begin VB.Label mLabelStatus 
      Caption         =   "(status)"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   255
      Left            =   720
      TabIndex        =   11
      Top             =   8160
      Width           =   3255
   End
   Begin VB.Label Label10 
      Caption         =   "Etat:"
      Height          =   255
      Left            =   240
      TabIndex        =   10
      Top             =   8160
      Width           =   375
   End
End
Attribute VB_Name = "FormMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
' Project: Enregistreur Piscine
' Copyright (C) 2010 ralfoide gmail com.
' License: GPLv3
'
' This program is free software: you can redistribute it and/or modify
' it under the terms of the GNU General Public License as published by
' the Free Software Foundation, either version 3 of the License, or
' (at your option) any later version.
'
' This program is distributed in the hope that it will be useful,
' but WITHOUT ANY WARRANTY; without even the implied warranty of
' MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
' GNU General Public License for more details.
'
' You should have received a copy of the GNU General Public License
' along with this program.  If not, see <http://www.gnu.org/licenses/>.

Option Explicit
Option Base 0

'MSDN VB6:
'  http://msdn.microsoft.com/en-us/library/aa338032(v=VS.60).aspx
'Tutoriaux VB6:
'  http://www.vb6.us/
  
'Declare use of the DLL
'K8047D.DLL interface

' WIN32
Private Declare Sub Sleep Lib "kernel32" (ByVal dwMilliseconds As Long)

'GENERAL PROCEDURES
Private Declare Sub StartDevice Lib "k8047d.dll" ()
Private Declare Sub StopDevice Lib "k8047d.dll" ()

'INPUT PROCEDURE
Private Declare Sub ReadData Lib "k8047d.dll" (Array_Pointer As Long)

'OUTPUT PROCEDURE
Private Declare Sub SetGain Lib "k8047d.dll" (ByVal Channel_no As Long, ByVal Gain As Long)
Private Declare Sub LEDon Lib "k8047d.dll" ()
Private Declare Sub LEDoff Lib "k8047d.dll" ()

'Declare variables
Dim DataBuffer(7) As Long

' Record channels 1, 2 and 3
Const NumChannels As Integer = 3
'1 Day = 60*24=1440 minutes
Const DataSize As Integer = 1440
' Version for state file.
Const StateFileVersion As Integer = 2
' State file name in app dir.
Const StateFilename As String = "Sauvegarde.txt"
'Change file name in app dir.
Const ChangeFilename As String = "Changements.csv"

Const EmptyEvent As String = "(vide)"

' Non-saved state
Dim StartTime As Variant
Dim LastChange As Integer
Dim IsDeviceStarted As Boolean

' Saved state
Private Type ChannelData
    ' Save state
    Data(DataSize) As Integer
    VoltThreshold As Integer
    
    ' Non-saved state
    UseThreshold As Boolean
    UseTemp As Boolean
    Volts As Integer
    Gain As Integer
    CoefDataToVolts As Double
    CoefVoltsToData As Double
    DataThreshold As Integer ' 0..255 for actual threshold
End Type

Dim Threshold As Integer ' en Volts pour affichage
Dim IsSimulation As Boolean
Dim LastIndex As Integer
Dim LastHourMin As Integer
Dim LastWritten As Integer
Dim Channels(NumChannels) As ChannelData
Dim RecentEvents() As String

Private Sub Form_Load()
    Dim i As Integer
    Dim c As Integer

    IsDeviceStarted = False
    LastChange = -1
    mLabelError.Caption = ""
    mBtnEraseEventList_Click

    IsSimulation = False
    LastIndex = -1
    LastHourMin = -1
    Threshold = 10

    For c = 0 To NumChannels - 1
        With Channels(c)
            ' Channel #1 and #2 are volt/threshold, #3 is temp
            .UseThreshold = c < 2
            .UseTemp = c >= 2
                    
            ' Gain: 1=30V, 2=15V, 5=6V, 10=3V
            ' 30V for channel #1 and #2, 15V for #3 and #4
            .Gain = IIf(c < 2, 1, 2)
            .Volts = IIf(c < 2, 30, 15)

            .CoefDataToVolts = .Volts / 256
            .CoefVoltsToData = 1 / .CoefDataToVolts

            .VoltThreshold = 10
            .DataThreshold = -1

            For i = 0 To DataSize - 1
                .Data(i) = -1
            Next i
        End With
    Next c
    
    If Not LoadState Then
        ' failed to restore from file...
    End If
    
    If Not IsSimulation Then
        On Error Resume Next
        StartDevice
        If Err.Number = 0 Then
            IsDeviceStarted = True
            Sleep 300
        Else
            DisplayError "Erreur DLL"
        End If
        On Error GoTo 0
    End If
    
    If IsSimulation Then
        mTimer1.Interval = 1000 ' 1 second
    Else
        mTimer1.Interval = 60000 ' 1 minute
    End If
    mTimer1.Enabled = False
    
    mTextThreshold.Text = Channels(0).VoltThreshold
    
    If IsSimulation Then mCheckSimulation.value = 1
    
    Form_Paint

    ' Commence en mode demarre
    If IsDeviceStarted Or IsSimulation Then
        DoStart
    End If
    
    FormMain.Caption = FormMain.Caption + " " + Format(App.Major) + "." + Format(App.Minor) + "." + Format(App.Revision)

End Sub

Private Sub Form_Paint()
    Dim c As Integer
    
    For c = 0 To NumChannels - 1
        DrawChannel c
    Next c
End Sub


Private Sub Form_Terminate()
    ' Stop_click already calls SaveState
    mBtnStop_Click
    
    If IsDeviceStarted Then
        ' We need to manually refresh the LED state
        mCheckLED_Click
        Sleep 100
        StopDevice
        IsDeviceStarted = False
    End If
End Sub

Private Sub Form_Unload(Cancel As Integer)
    If mTimer1.Enabled = True Then
        ' If currently recording, ask user for confirmation to quit
        If MsgBox("Enregistrement piscine en cours. Etes vous sûr de vouloir quitter ?", _
            vbYesNo + vbQuestion + vbApplicationModal, _
            "Quitter Enregistreur Piscine ?") <> vbYes Then
            Cancel = 1
        End If
    End If
End Sub

Private Sub mBtnEraseEventList_Click()
    Dim i As Integer
    
    mListEvents.Clear
    LastChange = -1
    ReDim RecentEvents(0)
    RecentEvents(0) = EmptyEvent
    
    For i = LBound(RecentEvents) To UBound(RecentEvents)
        mListEvents.AddItem RecentEvents(i)
    Next
End Sub

Private Sub SetupGain()
    Dim c As Integer
    
    For c = 0 To NumChannels - 1
        If IsDeviceStarted Then
            SetGain c + 1, Channels(c).Gain
        End If
    Next c
    
    mTextThreshold_Change
End Sub

Private Sub mCheckLED_Click()
    If IsDeviceStarted Then
        If mCheckLED.value = 1 Then LEDon Else LEDoff
    End If
End Sub

Private Sub mCheckSimulation_Click()
    IsSimulation = (mCheckSimulation.value = 1)
End Sub

Private Sub mBtnStart_Click()
    ' clear error field
    mLabelError.Caption = ""
    
    DoStart
End Sub

Private Sub DoStart()
    Dim i As Integer
    Dim c As Integer
    
    SetupGain
    
    mTimer1.Enabled = True
    
    mLabelStatus.ForeColor = &HFF0000
    If IsSimulation Then
        mLabelStatus.Caption = "Enregistrement (simulation)"
    Else
        mLabelStatus.Caption = "Enregistrement en cours"
    End If
    mCheckLED.value = 1
    mTimer1_Timer

    mBtnStart.Enabled = False
    mBtnStop.Enabled = True
End Sub

Private Sub mBtnStop_Click()
    mTimer1.Enabled = False
    mLabelStatus.Caption = "Arrêté"
    mLabelStatus.ForeColor = &H0&
    mCheckLED.value = 0
    
    SaveState
    
    mBtnStart.Enabled = True
    mBtnStop.Enabled = False
End Sub

Private Sub mTextThreshold_Change()
    Dim c As Integer
    Dim v As Double
    
    v = 0
    On Error Resume Next ' ignore cast failures
    v = Val(mTextThreshold.Text)
    
    For c = 0 To NumChannels - 1
        With Channels(c)
            If .UseThreshold Then
                .VoltThreshold = v
                .DataThreshold = v * .CoefVoltsToData
            End If
        End With
    Next c
    
    Form_Paint
End Sub

Private Sub mTimer1_Timer()
    ReadOne
    ' Save sate every hour
    If LastIndex Mod 60 = 0 Then
        SaveState
    End If
End Sub

Private Sub mBtnUpdateNow_Click()
    mTimer1_Timer
End Sub

Private Sub ReadOne()
    Dim c As Integer, value As Integer
    Dim s As String
    Dim t As Variant
    Dim h As Integer, m As Integer
    
    t = Time
    h = hour(t)
    m = minute(t)
    LastIndex = LastIndex + 1
    While LastIndex >= DataSize
        LastIndex = LastIndex - DataSize
    Wend
    LastHourMin = h * 60 + m
    
    mLabelTime.Caption = Format(h, "00") + "h " + Format(m, "00")
    
    If IsDeviceStarted Then
        ReadData DataBuffer(0)
    Else
        SimulateRead
    End If
    
    mTextLoggerIndex.Text = Format(DataBuffer(0)) + "," + Format(DataBuffer(1))

    For c = 0 To NumChannels - 1
       
        ' canal 0..3 is data byte #2..5
        value = DataBuffer(c + 2)
        Channels(c).Data(LastIndex) = value
        DrawChannel c
    
        mTextVolt(c).Text = Format(Channels(c).CoefDataToVolts * value, "0.0 V")
    
        If c = 2 And Channels(c).UseTemp Then
            mTextTemp.Text = Format(101 * value / 256 - 23, "  0.0°")
        End If
    
        If c = 0 And Channels(c).UseThreshold Then
            ' Process threshold change on channel 0
            value = IIf(value >= Channels(c).DataThreshold, 1, 0)
            If value <> LastChange Then
                AddEvent value
                LastChange = value
            End If
        End If
    
    Next c
    
End Sub

Private Sub AddEvent(ByVal value As Integer)
    Dim h As Integer, m As Integer, i As Integer, f As Integer
    Dim s As String
    
    m = LastHourMin Mod 60
    h = Int(LastHourMin / 60)

    s = Format(Date, "dd mmm") + " " + _
        Format(h, "00") + ":" + Format(m, "00") + " " + _
        IIf(value = 1, "Marche", "Arret")
    
    ' Add to array and list
    i = UBound(RecentEvents)
    If i = 0 And RecentEvents(0) = EmptyEvent Then
        RecentEvents(0) = s
        mListEvents.Clear
        mListEvents.AddItem s
    Else
        i = i + 1
        ReDim Preserve RecentEvents(i)
        RecentEvents(i) = s
        mListEvents.AddItem s, 0
    End If
    
    ' write to disk
    On Error GoTo erreur_writechange
    f = FreeFile
    Open App.Path & "\" & ChangeFilename For Append Access Write Lock Write As f
    
    If LOF(f) = 0 Then
        Print #f, "Jour;Mois;Heure;Etat"
    End If
    
    ' Use comma for US and ; for FR
    Print #f, Replace(s, " ", ";")
    
    Close f
    Exit Sub
    
erreur_writechange:
    DisplayError "Erreur écriture évènement"
End Sub

Private Sub SimulateRead()
    Dim b As Integer, i As Integer
    Dim m As Integer, h As Integer
    
    m = LastIndex Mod 60
    h = Int(LastIndex / 60)
    LastHourMin = LastIndex
    mLabelTime.Caption = Format(h, "00") + "h " + Format(m, "00")
    
    b = (256 - 4 * 20) * ((Sin(LastHourMin * 3.14159265385 * 6 / DataSize) + 1) / 2)
    For i = 0 To 5
        DataBuffer(i) = (256 + b - 40 + 10 + 20 * i) Mod 256
    Next
End Sub

Private Sub DrawChannel(channel As Integer)
    DrawChannel_ Channels(channel), Channels(channel).Data, mPicture(channel)
End Sub


Private Sub DrawChannel_(ByRef channel As ChannelData, ByRef Data() As Integer, ByRef picbox As PictureBox)
    Dim w As Integer, h As Integer, h2 As Integer
    Dim d As Integer, i As Integer, index As Integer
    Dim x As Integer, y As Integer
    Dim y1 As Integer, y2 As Integer
    Dim x1 As Integer, x2 As Integer
    Dim t As Integer, th As Integer
    Dim lastx As Integer
    Dim hour As Integer, minute As Integer
    Dim xcoef As Double, ycoef As Double, tcoef As Double
    Dim s As String
    
    picbox.Refresh
    
    w = picbox.ScaleWidth
    h2 = picbox.ScaleHeight
    
    th = picbox.TextHeight("24")
    h = h2 - th
    
    If channel.UseTemp Then
        h = h - th
        h2 = h2 - th
    End If
    
    y1 = 1
    y2 = h - 1
    ycoef = (y2 - y1) / 256
    
    x1 = 1
    x2 = w - 1
    xcoef = (x2 - x1) / DataSize
    
    ' Couleurs: http://msdn.microsoft.com/en-us/library/d2dz8078(VS.80).aspx
    
    ' ---- draw horizontal threadshold line
    t = -1
    If channel.UseThreshold Then
        t = channel.DataThreshold
        picbox.ForeColor = QBColor(10) ' light green
        y = y2 - t * ycoef
        picbox.Line (0, y)-(w, y)
    End If
    
    ' ---- draw horizontal low/high borders
    picbox.ForeColor = QBColor(8) ' gris
    picbox.Line (0, 0)-(w, 0)
    picbox.Line (0, h - 1)-(w, h - 1)

    ' ---- draw vertical hour ticks
    tcoef = (w - 1) / 24
    minute = LastHourMin Mod 60
    hour = Int(LastHourMin / 60)

    For i = 0 To 25
        x = Int(x1 + (i * 60 - minute) * xcoef)
        If x > DataSize Then
            Exit For
        ElseIf x >= 0 Then
            If hour Mod 6 = 0 Then
                y = 0
            ElseIf hour Mod 2 = 0 Then
                y = h / 2
            Else
                y = h * 3 / 4
            End If
            picbox.Line (x, y)-(x, h)

            If hour Mod 2 = 0 Then
                s = str(hour)
                picbox.CurrentX = Int(x - picbox.TextWidth(s) / 2)
                picbox.CurrentY = h
                picbox.Print s
            End If
        End If
        hour = hour + 1
        If hour >= 24 Then hour = hour - 24
    Next

    ' ---- draw data curve
    lastx = -1
    index = LastIndex + 1
    minute = (LastHourMin + 1) Mod 120
    For i = 0 To DataSize - 1
        If index >= DataSize Then index = index - DataSize
        d = Data(index)
        
        x = Int(x1 + i * xcoef)
        
        If d >= 0 Then
            y = y2 - d * ycoef
            If lastx < 0 Then
                lastx = x
                picbox.CurrentX = x
                picbox.CurrentY = y
            End If
            If d > t Then
                picbox.ForeColor = QBColor(12) ' light red
            Else
                picbox.ForeColor = QBColor(0) ' noir
            End If
            picbox.Line -(x, y)
        Else
            lastx = -1
        End If
    
        If channel.UseTemp And minute = 0 Then
            s = Format(101 * d / 256 - 23, "0.0°")
            picbox.CurrentX = Int(x - picbox.TextWidth(s) / 2)
            picbox.CurrentY = h + th
            picbox.Print s
            
            picbox.CurrentX = x
            picbox.CurrentY = y
        End If
    
        index = index + 1
        minute = minute + 1
        If minute = 120 Then minute = 0
   
    Next i
End Sub

Private Function LoadState() As Boolean
    Dim c As Integer, i As Integer, f As Integer, n As Integer, num As Integer, version As Integer
    Dim s As String
    
    version = 0
    
    On Error GoTo erreur_load
    f = FreeFile
    Open App.Path & "\" & StateFilename For Input Access Read Lock Write As f
    
    If LOF(f) > 0 Then
        Input #f, version
                
        If version = StateFileVersion Then
            Input #f, Threshold
            Input #f, IsSimulation
            Input #f, LastWritten
            Input #f, LastIndex
            Input #f, LastHourMin

            n = UBound(RecentEvents)
            Input #f, n
            ReDim RecentEvents(n)
            For i = 0 To n
                Input #f, RecentEvents(i)
            Next
            
            For c = 0 To NumChannels - 1
                With Channels(c)
                    For i = 0 To DataSize - 1
                        Input #f, .Data(i)
                    Next
                End With
            Next c
        End If
    End If
    Close f
    
    mListEvents.Clear
    For i = LBound(RecentEvents) To UBound(RecentEvents)
        mListEvents.AddItem RecentEvents(i), 0
    Next
    
    LoadState = (version = StateFileVersion)
    Exit Function

erreur_load:
    ' Err 53 (File Not Found) is OK here
    If Err.Number <> 53 Then
        DisplayError "Chargement:"
    End If
    LoadState = False
End Function

Private Sub SaveState()
    Dim c As Integer, i As Integer, f As Integer, n As Integer
    
    On Error GoTo erreur_save
    f = FreeFile
    Open App.Path & "\" & StateFilename For Output Access Write Lock Write As f
    Write #f, StateFileVersion
    Write #f, Threshold
    Write #f, IsSimulation
    Write #f, LastWritten
    Write #f, LastIndex
    Write #f, LastHourMin
    
    n = UBound(RecentEvents)
    Write #f, n
    For i = LBound(RecentEvents) To UBound(RecentEvents)
        Write #f, RecentEvents(i)
    Next
    
    For c = 0 To NumChannels - 1
        With Channels(c)
            For i = 0 To DataSize - 1
                Write #f, .Data(i)
            Next
        End With
    Next c
    
    Close f
    
    Exit Sub
    
erreur_save:
    DisplayError "Sauvegarde:"
End Sub

Private Sub DisplayError(ByVal str As String)
    Dim s1 As String
    
    s1 = str + " (" + Format(Err.Number) + " : " + Err.Description + ")"
    mLabelError.Caption = s1
    
    If mLabelError.ToolTipText = "" Then
        mLabelError.ToolTipText = s1
    Else
        mLabelError.ToolTipText = s1 + " / " + mLabelError.ToolTipText
    End If
    
    
    Err.Clear
End Sub
